import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
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
}