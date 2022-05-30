const userModel = require('../schema-models/user')
const jwt = require('jsonwebtoken');

const createUser = async(req, res) => {
    console.log(req.body, "body requuuu");

    let { email } = req.body;
    try {
        let db_user = await userModel.findOne({ email: email });
        console.log(db_user, "user found");
        if (db_user) {
            return res.json({
                status: 200,
                message: "User already exist"
            })
        }
        let saved = new userModel(req.body);
        await saved.save().then(result => {
            console.log(result, "result");
            return res.render('pages/login.ejs', result);
        })

    } catch (e) {
        console.log(e);
        return res.json({
            status: "error",
            message: e
        })
    }

}


const frontpage = (req, res) => {
    res.render('pages/index.ejs');
}
module.exports = {
    frontpage: frontpage,
    createUser: createUser,
}