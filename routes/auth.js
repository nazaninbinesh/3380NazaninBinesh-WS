var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Authenticate the User
var controller = require("../controllers/auth")


//Register the user
router.post('/api/auth/register', controller.registerUser);


//Authenticate the user
router.get('/api/authorize', controller.authorize);


//Login
router.post('/api/login', controller.login)
// add this to the bottom of AuthController.js
module.exports = router;