import dotenv from 'dotenv';
dotenv.config();
const secretAccessToken = process.env.JWT_ACCESSTOKEN_SECRET;
const secretRefreshToken = process.env.JWT_REFRESHTOKEN_SECRET;
const secretMailToken = process.env.JWT_MAIL_SECRET;
import jwt from "jsonwebtoken";

const JWTUntils = {
    generateAccessToken: (user) => {
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(payload, secretAccessToken, {expiresIn: '30s'})
        return token;
    },
    generateRefreshToken: (user) => {
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(payload, secretRefreshToken, {expiresIn: '365d'})
        return token;
    },
    generateEmailToken: (email) => {
        const token = jwt.sign({email}, secretMailToken, {expiresIn: '120s'})
        return token;
    }
}

export default JWTUntils;