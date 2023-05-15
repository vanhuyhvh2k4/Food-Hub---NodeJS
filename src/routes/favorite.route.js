import express from 'express';
const router = express.Router();
import FavoriteController from '../controllers/FavoriteController.js';
import verifyToken from '../middlewares/VerifyToken.middlewares.js';

router.get('/getFavoriteFood', verifyToken.verifyTokenJWT, FavoriteController.getFavoriteFood);

router.get('/getFavoriteShop', verifyToken.verifyTokenJWT, FavoriteController.getFavoriteShop);

export default router;

