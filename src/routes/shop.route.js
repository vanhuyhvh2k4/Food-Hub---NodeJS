import express from 'express';
const router = express.Router();
import ShopController from '../controllers/ShopController.js';
import {verifyToken} from '../middlewares/VerifyToken.middlewares.js'

router.get('/getInfo', ShopController.getInfo);

router.get('/getFood', verifyToken, ShopController.getFood);

export default router;
