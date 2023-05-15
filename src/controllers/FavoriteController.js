import db from '../config/db.config.js';

class FavoriteController {
    //[GET] baseURL/favorite/getFavoriteFood
    getFavoriteFood (req, res) {
        try {
            const userId = req.user.id;

            db.query('SELECT food_item.id, shop.name AS shopName, food_item.name, food_item.image, food_item.description, food_item.price FROM food_item JOIN food_like ON food_like.foodId = food_item.id JOIN user ON user.id = food_like.userId JOIN shop ON food_item.shopId = shop.id WHERE user.id = ?', ([userId]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'favorite/getFoodFavorite.success',
                        message: 'Success',
                        data: {
                            foodList: result
                        }
                    })
                } else {
                    res.status(404).json({
                        code: 'favorite/getFoodFavorite.notFound',
                        message: 'Not Found any food'
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'favorite/getFoodFavorite.error',
                message: 'Something went wrong',
                error: error.message
            })
        }
    }
    getFavoriteShop (req, res) {
        try {
            const userId = req.user.id;
            db.query('SELECT shop.id, shop.name, shop.image, shop.isTick, shop.shipFee, shop.timeShipping FROM shop JOIN shop_like ON shop_like.shopId = shop.id JOIN user ON user.id = shop_like.userId WHERE shop_like.userId = ?', ([userId]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'favorite/getFavoriteShop.success',
                        message: 'Success',
                        data: {
                            shopList: result
                        }
                    })
                } else {
                    res.status(404).json({
                        code: 'favorite/getFavorite.notFound',
                        message: 'Not Found any shop'
                    });
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 'favorite/getFavoriteShop.error',
                message: 'Something went wrong',
                error: error.message
            })
        }
    }

}

export default new FavoriteController;