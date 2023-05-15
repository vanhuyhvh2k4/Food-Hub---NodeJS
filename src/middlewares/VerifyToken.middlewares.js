import dotenv from 'dotenv';
dotenv.config();
import jwt, { verify } from "jsonwebtoken";

const verifyToken = {
    verifyTokenJWT: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN_SECRET, (err, user) => {
                if (err) res.status(403).json({
                    code: 'InvalidToken',
                    message: 'Token is invalid'
                });
                else {
                    req.user = user;
                    next();
                }
            })
        } else {
            res.status(401).json({
                code: 'Unauthorized',
                message: 'You are not authenticated'
            });
        }
    },

    verifyTokenMail: (req, res, next) => {
        const token = req.query.token;
        const email = req.params.email;
        
        if (token && email) {
            jwt.verify(token, process.env.JWT_MAIL_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json({
                        code: 'InvalidToken',
                        message: 'Token is invalid'
                    });
                } else {
                    if (user.email === email) {
                        next();
                    } else {
                        res.status(403).json({
                            code: 'Unauthorized',
                            message: 'Email and token do not match'
                        });
                    }
                }
            })
        } else {
            res.json({
                code: 'Unauthorized',
                message: 'You are not authenticated'
            })
        }
    }
}

export default verifyToken;