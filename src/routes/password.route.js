import express from 'express';
const router = express.Router();
import PasswordController from '../controllers/PasswordController.js';
import CheckEmailMiddleware from '../middlewares/CheckEmail.middleware.js';
import verifyToken from '../middlewares/VerifyToken.middlewares.js';

router.post('/forgot', CheckEmailMiddleware.checkHasMail, PasswordController.sendMail);

router.patch('/reset/:email', verifyToken.verifyTokenMail, PasswordController.reset);

export default router;

