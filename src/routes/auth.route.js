import express from 'express';
import multer from 'multer';
const router = express.Router();
import authController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/Auth.middlewre.js';
import verifyToken from '../middlewares/VerifyToken.middlewares.js';
import multerErrorMiddleware from '../middlewares/MulterError.middleware.js';
import CheckEmailMiddleware from '../middlewares/CheckEmail.middleware.js';

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        const error = new Error('Only JPG, PNG, and WebP files are allowed');
        error.status = 400; // Set the error status code
        cb(error)
    }
}

const upload = multer({storage: multer.memoryStorage(), fileFilter})

router.post('/register', authMiddleware.checkEmail, authController.register);

router.post('/login', authController.login);

router.post('/token', authController.refreshToken);

router.patch('/profile/:userId', verifyToken.verifyTokenJWT, upload.single('avatar'), multerErrorMiddleware, authController.changeAvatar);

router.put('/profile/:userId', verifyToken.verifyTokenJWT, authController.changeProfile);

router.post('/password', CheckEmailMiddleware.checkHasMail, authController.sendMail);

router.patch('/password/:email', verifyToken.verifyTokenMail, authController.reset);

export default router;
