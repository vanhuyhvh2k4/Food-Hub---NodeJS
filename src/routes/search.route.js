import express from 'express';
const router = express.Router();
import SearchController from '../controllers/SearchController.js';
import verifyToken from '../middlewares/VerifyToken.middlewares.js';

router.get('/', SearchController.search);

router.get('/result', verifyToken.verifyTokenJWT, SearchController.result);

export default router;
