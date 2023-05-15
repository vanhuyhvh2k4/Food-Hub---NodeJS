import db from '../config/db.config.js';

class FoodController {
    //[GET] baseURL/food/getFood
    getFood (req, res) {
        try {
            const foodName = req.query.foodName;
            const shopName = req.query.shopName;

            db.query('SELECT food_item.id, food_item.name, food_item.image, food_item.description,food_item.price FROM food_item JOIN shop ON shop.id = food_item.shopId WHERE food_item.name = ? AND shop.name = ?', ([foodName, shopName]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'food/getFood.success',
                        message: 'success',
                        data: result[0]
                    });
                } else {
                    res.status(404).json({
                        code: 'food/getFood.notFound',
                        message: 'dont found food',
                    });
                }
            })
        } catch (error) {
            res.status(500).json([{
                code: 'food/getFood.error',
                message: 'something went wrong',
                error: error.message
            }])
        }
    }
}

export default new FoodController;