import express from 'express';
const router = express.Router();
import verifyToken from '../middlewares/VerifyToken.middlewares.js';
import CheckoutController from '../controllers/CheckoutController.js';

router.post('/cart', verifyToken.verifyTokenJWT, CheckoutController.addCart);

router.get('/number', verifyToken.verifyTokenJWT, CheckoutController.getNumber);

router.get('/cart', verifyToken.verifyTokenJWT, CheckoutController.getCart);

router.delete('/cart/:cartId', verifyToken.verifyTokenJWT, CheckoutController.deleteCart);

router.get('/bill', verifyToken.verifyTokenJWT, CheckoutController.getBill);

router.post('/order', verifyToken.verifyTokenJWT, CheckoutController.order);

router.get('/order', verifyToken.verifyTokenJWT, CheckoutController.myOrder);

export default router;
