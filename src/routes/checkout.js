import express from 'express';
const router = express.Router();
import verifyToken from '../middlewares/VerifyToken.middlewares.js';
import CheckoutController from '../controllers/CheckoutController.js';

router.post('/cart', verifyToken.verifyTokenJWT, CheckoutController.addCart);

router.get('/getNumber', verifyToken.verifyTokenJWT, CheckoutController.getNumber);

router.get('/getCart', verifyToken.verifyTokenJWT, CheckoutController.getCart);

router.delete('/deleteCart/:cartId', verifyToken.verifyTokenJWT, CheckoutController.deleteCart);

router.get('/getBill', verifyToken.verifyTokenJWT, CheckoutController.getBill);

export default router;
