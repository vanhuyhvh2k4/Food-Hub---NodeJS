
import db from '../config/db.js';

class ShopController {

    getInfo (req, res) {
        try {
            const shopName = req.query.shopName;
    
            db.query('SELECT shop.id, shop.name, shop.image, shop.background, shop.place, shop.isTick FROM shop WHERE shop.name = ?', ([shopName]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'shop/getInfo.success',
                        message: 'Success',
                        data: result[0]
                    })
                } else {
                    res.status(404).json({
                        code: 'shop/getInfo.dontFound',
                        message: 'No shop found',
                    });   
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'shop/getInfo.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }
    
    getFood (req, res) {
        try {
            const userId = req.user.id;
            const shopName = req.query.shopName;
            db.query('SELECT food_item.id, food_item.name, food_item.image, food_item.description, food_item.price, IF (food_like.id IS null, 0, 1) AS liked FROM food_item JOIN shop ON shop.id = food_item.shopId LEFT JOIN food_like ON food_like.foodId = food_item.id AND food_like.userId = ? WHERE shop.name = ?', ([userId, shopName]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'shop/getFood.success',
                        message: 'Success',
                        data: {
                            foodList: result
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'shop/getFood.notFound',
                        message: 'Not found the food',
                    });
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 'shop/getFood.error',
                message: 'something went wrong',
                error: error.message
            });
        }
    }
}

export default new ShopController;