import express from 'express';
const router = express.Router();
import HomeController from '../controllers/HomeController.js';
import {verifyToken} from '../middlewares/VerifyToken.middlewares.js';

router.post('/search', HomeController.search);

router.get('/getUser', verifyToken, HomeController.getUser);

router.get('/getShop', verifyToken, HomeController.getShop);

router.get('/getFood', verifyToken, HomeController.getFood);

export default router;
