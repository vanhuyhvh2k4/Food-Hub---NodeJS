import express from 'express';
const router = express.Router();
import HomeController from '../controllers/HomeController.js';
import verifyToken from '../middlewares/VerifyToken.middlewares.js';

router.post('/search', HomeController.search);

router.get('/getUser', verifyToken.verifyTokenJWT, HomeController.getUser);

router.get('/getShop', verifyToken.verifyTokenJWT, HomeController.getShop);

router.get('/getFood', verifyToken.verifyTokenJWT, HomeController.getFood);

export default router;
