import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import path from 'path';
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

    //[PATCH] baseUrl/food/changeLike/:foodId
    changeLike (req, res) {
        try {
            const userId = req.user.id;
            const foodId = req.params.foodId;
            const status = req.body.statusLike;

            if (status === true) {
                db.query('DELETE FROM food_like WHERE foodId = ? AND userId = ?', ([foodId, userId]), (err, result) => {
                    if (err) throw err;
                    if (result) {
                        res.status(200).json({
                            code: 'food/changeLike.success',
                            message: 'success',
                        });
                    } else {
                        res.status(404).json({
                            code: 'food/changeLike.notFound',
                            message: 'dont find food or user'
                        });
                    }
                })
            } else if (status === false) {
                db.query('INSERT INTO food_like (userId, foodId) VALUES (?, ?)', ([userId, foodId]), (err, result) => {
                    if (err) throw err;
                    if (result) {
                        res.status(200).json({
                            code: 'food/changeLike.success',
                            message: 'success',
                        });
                    } else {
                        res.status(404).json({
                            code: 'food/changeLike.notFound',
                            message: 'dont find food or user'
                        });
                    }
                })
            }
        } catch (error) {
            res.status(500).json({
                code: 'food/changeLike.error',
                message: 'something went wrong',
                error: error.message
            });
        }
    }

    //[POST] baseUrl/food/newFood
    async newFood (req, res) {
        try {
            const userId = req.user.id;
            const name = req.body.name;
            const categoryId = req.body.categoryId;
            const description = req.body.description;
            const price = req.body.price;
            const storage = getStorage();
            const storageRef = ref(storage, `food_image/${userId}-${name}${path.extname(req.file.originalname)}`);

            //get shop id
            const shopId = await db.promise().query('SELECT shop.id FROM shop JOIN user ON user.id = shop.userId WHERE user.id = ?', [userId])
    
            // //upload
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer);
            const url = await getDownloadURL(snapshot.ref);

            db.query('INSERT INTO food_item(foodCategoryId, shopId, name, image, description, price) VALUES (?, ?, ?, ?, ?, ?)', ([categoryId, shopId[0][0].id, name, url, description, price]), (err, result) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        code: 'food/newFood.success',
                        message: 'add food successfully'
                    });
                } else {
                    res.status(404).json({
                        code: 'food/newFood.notFound',
                        message: 'add food not found'
                    });
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'food/newFood.error',
                message: 'something went wrong',
                error: error.message
            })
        }
    }
    
    //[GET] baseUrl/search/result
    result (req, res) {
        try {
            const userId = req.user.id;
            const keyword = req.query.keyword;
            
            db.query('SELECT food_item.id, shop.name AS shopName, shop.place, food_item.name, food_item.image, food_item.description, food_item.price, IF (food_like.id IS null, 0, 1) as liked FROM food_item JOIN shop ON shop.id = food_item.shopId LEFT JOIN food_like ON food_like.foodId = food_item.id AND food_like.userId = ? WHERE food_item.name LIKE ?', ([userId,`%${keyword}%`]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'food/searchResult.success',
                        message: 'search result successfully',
                        data: result
                    })
                } else {
                    res.status(404).json({
                        code: 'food/searchResult.notFound',
                        message: 'search result not found'
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'food/searchResult.error',
                message: 'something went wrong',
                error: error.message
            });
        }
    }
}

export default new FoodController;