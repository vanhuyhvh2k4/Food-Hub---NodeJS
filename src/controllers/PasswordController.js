import md5 from "md5";
import db from "../config/db.config.js";
import JWTUntils from "../lib/jwt.js";
import sendMail from '../utils/mailer.js';
import 'dotenv/config';

class PasswordController {
    //[POST] baseURL/password/forgot
    sendMail(req, res) {
        try {
            const email = req.body.email;
            const emailToken = JWTUntils.generateEmailToken(email);
            sendMail(email, "Reset password", `<a href="${process.env.APP_URL}/forgot/reset/${email}?token=${emailToken}">Reset password</a>`)
    
            res.status(200).json({
                code: 'password/sendMail.success',
                message: 'we sent your email successfully',
                from: process.env.USERNAME_MAIL,
                to: email
            })
        } catch (error) {
            res.status(500).json({
                code: 'password/sendMail.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }

    //[GET] baseUrl/password/reset/:email
    reset (req, res) {
        try {
            const email = req.params.email;
            const newPassword = req.body.password;
            const hashPassword = md5(newPassword);

            db.query('UPDATE user SET password= ? WHERE user.email = ?', ([hashPassword, email]), (err, result) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        code: 'password/reset.success',
                        message: 'changed your password successfully'
                    })
                } else {
                    res.status(404).json({
                        code: 'password/reset.notFound',
                        message: 'email not found'
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'password/reset.error',
                message: 'something went wrong',
                error: error.message
            });
        }

    }
}


export default new PasswordController;