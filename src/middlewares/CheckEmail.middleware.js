import db from '../config/db.config.js';

export const checkEmail = {
    checkHasMail: (req, res, next) => {

        try {
            const clientEmail = req.body.email;

            db.query('SELECT * FROM user WHERE email = ?', ([clientEmail]), (err, user) => {
                if (err) throw err;
                if (user.length) {
                    next();
                } else {
                    res.status(404).json({
                        code: 'middleware/checkhHasEmail.notFound',
                        message: 'Email not found'
                    })
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'middleware/checkhHasMail.error',

                error: error.message
            })
        }
    }
}

export default checkEmail;