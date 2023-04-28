import db from '../config/db.js';

const authMiddleware = {
    checkEmail: (req, res, next) => {
        try {
            const email = req.body.email;

            db.query(`SELECT * FROM users WHERE email='${email}'`, (err, users) => {
                if (err) throw err;

                if (users.length) {
                    res.status(409).json({
                        code: 'auth/checkEmail.conflict',
                        message: 'Email already exists'
                    })
                } else {
                    next();
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'auth/checkEmail.error',
                message: 'Something went wrong',
                error: error
            })
        }
    },
}

export default authMiddleware;