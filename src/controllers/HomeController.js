import db from '../config/db.config.js';

class HomeController {

    //[POST]baseURL/home/search
    search(req, res) {
        try {
            const foodName = req.body.foodName;
            if (foodName.length) {
                db.query('SELECT id, name, image FROM food_item WHERE name LIKE ? GROUP BY name', [`%${foodName}%`], (err, result) => {
                    if (err) throw err;

                    if (!result.length) {
                        res.status(404).json({
                            code: 'home/search.notFound',
                            message: 'No results found'
                        })
                    } else {
                        res.status(200).json({
                            code: 'home/search.success',
                            message: 'Success',
                            data: result
                        })
                    }
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 'home/search.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }

    //[GET] baseURL/home/getUser
    getUser(req, res) {
        try {
            const user = req.user;
            const query2 = '';
            db.query('SELECT id, fullName, avatar, email from user WHERE id = ?', [user.id], (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'home/getUser.success',
                        message: 'Success',
                        data: {
                            currentUser: result[0]
                        }
                    })
                } else {
                    res.status(404).json({
                        code: 'home/getUser.notFound',
                        message: 'User is not exists'
                    });
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'home/getUser.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }

    //[GET] baseURL/home/getShop
    getShop(req, res) {
        try {
            const userId = req.user.id;
            const foodType = req.query.foodType;

            db.query('SELECT shop.id, shop.name, shop.image, shop.isTick, shop.shipFee, shop.timeShipping, IF(shop_like.id IS NULL, 0, 1) as liked FROM shop INNER JOIN food_item ON shop.id = food_item.shopId INNER JOIN food_category ON food_item.foodCategoryId = food_category.id LEFT JOIN shop_like ON shop.id = shop_like.shopId AND shop_like.userId = ? WHERE food_category.name = ? GROUP BY shop.name', ([userId, foodType]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'home/getShop.success',
                        message: 'Success',
                        data: {
                            shopList: result
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'home/getShop.notFound',
                        message: 'Dont found the shop',
                    });
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'home/getUser.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }

    //[GET] baseURL/home/getFood
    getFood (req, res) {
        try {
            const userId = req.user.id;
            const foodType = req.query.foodType;

            db.query('SELECT shop.name AS shopName, food_item.id, food_item.name, food_item.image, food_item.description, food_item.price, shop.place, IF (food_like.id IS null, 0, 1) as liked FROM food_item JOIN food_category ON food_item.foodCategoryId = food_category.id JOIN shop ON food_item.shopId = shop.id LEFT JOIN food_like ON food_like.foodId = food_item.id AND food_like.userId = ? WHERE food_category.name = ? GROUP BY food_item.name', ([userId, foodType]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'home/getFood.success',
                        message : 'Success',
                        data: {
                            foodList: result
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'home/getFood.notFound',
                        message: 'Dont found the food',
                    });
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'home/getUser.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }
}

export default new HomeController;