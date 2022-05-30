const mongoose = require('mongoose');
const user = mongoose.Schema({
    username: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number },
    // profile_pic: String
}, { timestump: true });
module.exports = mongoose.model('user', user, "user");