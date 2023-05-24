import db from "../config/db.config.js";

export default function checkStatusOfOrder (req, res, next) {
    try {
        const orderId = req.params.orderId;

        db.query('SELECT status FROM food_order WHERE id =?', [orderId], (err, result) => {
            if (err) throw err;
            if (result[0].status === 'waiting confirm') {
                next();
            } else {
                res.status(403).json({
                    code: 'checkStatusOfOrder.forbidden',
                    message: 'You are not allowed to cancel'
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            code: 'checkStatusOfOrder.error',
            error: error.message
        })
    }
}