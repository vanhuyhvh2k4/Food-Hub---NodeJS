import jwt from 'jsonwebtoken';
import db from '../config/db.config.js';
import JWTUntils from '../lib/jwt.js';
import md5 from 'md5';

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

  home (req, res) {
    res.status(200).json('ok')
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
}

export default new AuthControlller;