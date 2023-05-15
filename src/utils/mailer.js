import nodeMailer from 'nodemailer';
import mailConfig from '../config/mail.config.js';

const sendMail = (to, subject, htmlContent) => {
    const transporter = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        service: "gmail",
        secure: false, // true for 465, false for other ports
        auth: {
          user: mailConfig.USERNAME, // generated ethereal user
          pass: mailConfig.PASSWORD, // generated ethereal password
        },
    });

    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent
    }
    return transporter.sendMail(options);
}

export default sendMail