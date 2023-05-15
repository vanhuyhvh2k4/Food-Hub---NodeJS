
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import db from '../config/db.js';

class ShopController {

    //[GET] baseURL/shop/getInfo
    getInfo (req, res) {
        try {
            const shopName = req.query.shopName;
    
            db.query('SELECT shop.id, shop.name, shop.image, shop.background, shop.place, shop.isTick, COUNT(food_item.id) as quantity FROM food_item JOIN shop ON shop.id = food_item.shopId WHERE shop.name = ?', ([shopName]), (err, result) => {
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
    
    //[GET] baseURL/shop/getFood
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

    checkShopName (req, res) {
        try {
            const shopName = req.body.shopName;
            db.query('SELECT * FROM shop WHERE shop.name = ?', ([shopName]), (err, result) => {
                if (err) throw err;
                if (result.length) {
                    res.status(409).json({
                        code: 'shop/checkName.conflict',
                        message: 'The name is already exists',
                    })
                } else {
                    res.status(200).json({
                        code: 'shop/checkName.success',
                        message: 'The name is valid'
                    });
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'error',
                message: 'Something went wrong',
                error: error.message
            });
        }
    }

    async create (req, res) {
        try {
            const userId = req.user.id;
            const storage = getStorage();
            const storageRef1 = ref(storage, `shop_image/${req.files['avatar'][0].originalname}`);
            const storageRef2 = ref(storage, `shop_background/${req.files['background'][0].originalname}`);
            const snapshot1 = await uploadBytesResumable(storageRef1, req.files['avatar'][0].buffer);
            const snapshot2 = await uploadBytesResumable(storageRef2, req.files['background'][0].buffer);
            const name = req.body.name;
            const address = req.body.address;
            const shipFee = req.body.shipFee;
            const timeShipping = req.body.timeShipping;

            const avatar = await getDownloadURL(snapshot1.ref);
            const background = await getDownloadURL(snapshot2.ref);

            db.query('INSERT INTO `shop`(`userId`, `name`, `image`, `background`, `place`, `shipFee`, `timeShipping`) VALUES (?,?,?,?,?,?,?)', ([userId, name, avatar, background, address, shipFee, timeShipping]), (err, result) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        code: 'shop/create.success',
                        message: 'Success'
                    })
                } else {
                    res.status(404).json({
                        code: 'shop/create.notFound',
                        message: 'dont found the user'
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'error',
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
}

export default new ShopController;