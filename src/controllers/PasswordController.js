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
            sendMail(email, "Reset password", `
            <div style="width: 100%; background-color: #fff;">
        <header style="background-color: #333; padding: 12px; color: #fff; display: flex; justify-content: end;">
            <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">VIEW IN BROWSER</span>
        </header>
        <main style="display: flex; flex-direction: column; align-items: center; padding: 32px;">
            <div style="display: flex; align-items: center;">
                <img style="width: 50px; height: 50px; flex-shrink: 0; object-fit: cover;"
                    src="https://th.bing.com/th/id/OIP.504ZOEY-quI4tFXyM-X0KgHaHa?pid=ImgDet&rs=1" alt="">
                <h2 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-left: 6px;">FOOD HUB</h2>
            </div>
            <h1 style="text-align: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-transform: uppercase;">Easy ordering, fast delivery</h1>
            <p style="text-align: justify; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">Hi,

                You are receiving this email because you requested to reset the password for your account on <b>FOOD HUB</b>. Please click the link below to reset your password:
                </p>
            <a href="${process.env.APP_URL}/forgot/reset/${email}?token=${emailToken}" style="background-color: rgb(124, 124, 239); border: none; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">SET PASSWORD</a>
            <p style="text-align: justify; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
                If you did not request to reset your password, please ignore this email. If you have any issues, please contact us for assistance.
                Best regards, <br>
                <b>FOOD HUB </b>
            </p>
            <hr width="100%" style="margin-top: 24px;">
        </main>
    </div>
            `)
            // <a href="${process.env.APP_URL}/forgot/reset/${email}?token=${emailToken}">Reset password</a>
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
    reset(req, res) {
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