var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

controller = require("../controllers/user")
// CREATES A NEW USER
router.post('/',controller.registerUser);

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/users/',controller.getUsers);

// GETS A SINGLE USER FROM THE DATABASE
// USER REGISTER SO THE PASSWORD IS ENCRYPTED
router.get('/users/:id',controller.getSingleUser);

// DELETES A USER FROM THE DATABASE
router.delete('/users/:id',controller.deleteUser);

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/users/:id',controller.updateUser);


module.exports = router;