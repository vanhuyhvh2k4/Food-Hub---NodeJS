import express from 'express';
const router = express.Router();
import HomeController from '../controllers/HomeController.js';
import verifyToken from '../middlewares/VerifyToken.middlewares.js';

router.get('/user', verifyToken.verifyTokenJWT, HomeController.getUser);

router.get('/shop', verifyToken.verifyTokenJWT, HomeController.getShop);

router.get('/food', verifyToken.verifyTokenJWT, HomeController.getFood);

export default router;
