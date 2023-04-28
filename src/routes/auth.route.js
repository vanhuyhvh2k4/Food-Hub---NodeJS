import express from 'express';
const router = express.Router();
import authController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/Auth.middlewre.js';
import {verifyToken} from '../middlewares/VerifyToken.middlewares.js';

router.post('/register', authMiddleware.checkEmail, authController.register);

router.post('/login', authController.login);

router.post('/refreshToken', authController.refreshToken);

router.get('/home', verifyToken, authController.home);

export default router;
