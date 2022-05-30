const userModel = require('../schema-models/user')
const homepage = (req, res) => {
    res.render('pages/index.ejs');
}
const login = (req, res) => { res.render('pages/login.ejs') }
const Login = async(req, res) => {
    console.log(req.body);
    try {
        let db_user = await userModel.findOne({ email: req.body.email, password: req.body.password });
        if (db_user)
            return res.render('pages/index.ejs', { username: db_user.username, email: db_user.email });

        return res.render('pages/login.ejs');

    } catch (e) {
        console.log(e);
        return res.json({
            status: "error",
            message: e
        })
    }
}
const register = (req, res) => { res.render('pages/register.ejs', { name: '', password: '' }) }

module.exports = {
    homepage,
    register,
    login,
    Login
}