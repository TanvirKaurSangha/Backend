const express = require('express');
const router = express.Router();
const controllers = require('../controllers/apiController');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.route('/').get(authController.homepage);
router.route('/register').get(authController.register);
router.route('/login').get(authController.login);
router.route('/Login').post(authController.Login);
router.route('/create_user').post(controllers.createUser);

router.route('/generateToken').get(controllers.generate_Token);
module.exports = router