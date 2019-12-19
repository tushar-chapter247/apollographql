var express = require('express');
var authRouter = express.Router();
const {
	auth: { userSignup },
} = require('../controllers');

/* GET users listing. */
authRouter.post('/signup', userSignup);

module.exports = authRouter;
