import jwt from 'jsonwebtoken';
import {getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject} from 'firebase/storage'
import db from '../config/db.config.js';
import JWTUntils from '../lib/jwt.js';
import md5 from 'md5';
import path from 'path'

class AuthControlller {
  //[POST] BaseURL/auth/register
  register (req, res) {
      try {
          const fullName = req.body.fullName;
          const email = req.body.email;
          const password = req.body.password;
          const passwordHash = md5(password);
          db.query(
              'INSERT INTO user (fullName, email, password) VALUES (?, ?, ?)',
              [fullName, email, passwordHash],
              (error, results, fields) => {
                if (error) {
                  throw error;
                }
                res.status(200).json({
                  code: 'auth/register.success',
                  message: 'Your account has been registered'
                })
              }
            );
      } catch (error)  {
          res.status(500).json({
              code: 'auth/register.error',
              error: error.message
          })
      }
  }

    //[POST] BaseURL/auth/login
  login (req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const passwordHash = md5(password);
      const query = `SELECT * FROM user WHERE email = "${email}" AND password = "${passwordHash}"`;
      let accessToken;
      let refreshToken;

      db.query(query, (error, results) => {
        if (error) throw error;

        if (results.length) {
          accessToken = JWTUntils.generateAccessToken(results[0])
          refreshToken = JWTUntils.generateRefreshToken(results[0])
          res.status(200).json({
            code: 'auth/login.success',
            message: 'login successful',
            data: {
              currentUser: results[0],
              accessToken,
              refreshToken
            }
          });
        } else {
          res.status(401).json({
            code: 'auth/login.unauthorized',
            message: 'Email or password is incorrect'
          })
        }
      })
    } catch (error) {
      res.status(500).json({
        code: 'auth/login.error',
        error: error.message
      })
    }
  }

  //[POST] BaseURL/auth/refreshToken
  refreshToken (req, res) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) res.status(401).json('you are not authenticated');
    jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN_SECRET, (err, user) => {
      if (err) res.status(403).json('token is invalid');

      const newAccessToken = JWTUntils.generateAccessToken(user);
      const newRefreshToken = JWTUntils.generateRefreshToken(user);
      res.status(200).json({
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      })
    })
  }

  //[PATCH] baseUrl/auth/changeAvatar/:userId
  async changeAvatar (req, res) {
    try {
      const storage = getStorage();
      const userId = req.user.id;

      const user = await db.promise().query('SELECT avatar FROM user WHERE id = ?', [userId]);
      const oldAvatarUrl = user[0].avatar;
      const hasOldAvatar = !!oldAvatarUrl;

      if (hasOldAvatar) {
        // Delete old image with same name
        const oldStorageRef = ref(storage, `user_avatar/${userId + path.extname(req.file.originalname)}`);
        await deleteObject(oldStorageRef);
      }
      
      //upload new image
      const storageReft = ref(storage, `user_avatar/${userId + path.extname(req.file.originalname)}`);
      const snapshot = await uploadBytesResumable(storageReft, req.file.buffer);
      const url = await getDownloadURL(snapshot.ref);

      db.query('UPDATE user SET avatar = ? WHERE id = ?', ([url, userId]), (err, result) => {
        if (err) throw err;
        if (result) {
          res.status(200).json({
            code: 'auth/changeAvatar.success',
            message: 'Successfully changed',
          })
        } else {
          res.status(404).json({
            code: 'auth/changeAvatar.notFound',
            message: 'not found user'
          })
        }
      })
    } catch (error) {
      res.status(500).json({
        code: 'auth/changeAvatar.error',
        message: 'something went wrong',
        error: error.message
      })
    }
  }

  //[PUT] baseUrl/auth/changeProfile/:userId
  changeProfile (req, res) {
    try {
      const userId = req.user.id;
      const fullName = req.body.fullName;
      const phone = req.body.phone;
      const address = req.body.address;

      db.query('UPDATE user SET fullName = ?, phone = ?, address = ? WHERE id = ?', ([fullName, phone, address, userId]), (err, result) => {
        if (err) throw err;
        if (result) {
          res.status(200).json({
            code: 'auth/changeProfile.success',
            message: 'Successfully changed',
          })
        } else {
          res.status(404).json({
            code: 'auth/changeProfile.notFound',
            message: 'not found user'
          })
        }
      });
    } catch (error) {
      res.status(500).json({
        code: 'auth/changeProfile.error',
        message: 'something went wrong',
        error: error.message
      })
    }
  }
}

export default new AuthControlller;