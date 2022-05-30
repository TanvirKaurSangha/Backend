const jwt = require('jsonwebtoken');
const userModel = require('../schema-models/user');
const multer = require('multer');

function auth(req, res, next) {
    let token = req.header('x-auth-token');

    if (!token) {
        return res.json({
            code: 599,
            message: 'Access denied. No token found.',
            data: []
        });
    } else {
        try {
            let decode = jwt.verify(token, "JWTSecretkey");
            let user_id = decode._id;
            userModel.findOne({ _id: user_id }).then(db_USER => {
                if (!db_USER) {
                    return res.json({ status: "error", message: "Unauthrized User" });
                }
                next();
            })

        } catch (e) {
            return res.json({
                code: 599,
                message: 'Session timeout.',
                data: []
            });
        }
    }

}
const token = async(data) => {
    let token = jwt.sign(data.toJSON(), 'JWTSecretkey', { expiresIn: 60 * 60 });
    return res.json({ status: 200, token: token, message: "Token Created" })
}

module.exports = { auth, token };