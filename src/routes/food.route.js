import express from 'express';
const router = express.Router();
import FoodController from '../controllers/FoodController.js';

router.get('/getFood', FoodController.getFood);

export default router;

