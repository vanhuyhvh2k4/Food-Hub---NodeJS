import express from 'express';
const router = express.Router();
import FavoriteController from '../controllers/FavoriteController.js';
import {verifyToken} from '../middlewares/VerifyToken.middlewares.js';

router.get('/getFavoriteFood', verifyToken, FavoriteController.getFavoriteFood);

router.get('/getFavoriteShop', verifyToken, FavoriteController.getFavoriteShop);

export default router;

