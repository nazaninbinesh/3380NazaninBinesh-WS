const users = require("../../3380NazaninBinesh-data/userDb");

//Add in bcrypt, jsonwebtoken, source the config file (where are private parts are)
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config");

exports.registerUser = async function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const hello =  users.find({email: req.body.email}).limit(1);
  console.log(hello);
   

  users.create(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: req.body.birthDate,
      country: req.body.country,
      province: req.body.province,
      city: req.body.city,
      address: req.body.address,
      postalCode: req.body.postalCode,
      email: req.body.email,
      password: hashedPassword,
    },
    function (err, user) {     
      if (err)
        return res
          .status(500)
          .send("There was a problem registering the user.");
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    }
  );
};

exports.authorize = async function (req, res) {
 
  var token = req.headers["x-access-token"];
  //No Token, No Soup!
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  //Verify the JWT token with the jsonwebtoken library
  jwt.verify(token, config.secret, function (err, decoded) {
    //Bad Token, No Soup!
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    //Its Valid, dont send it back but, check there is a valid user

    //res.status(200).send(decoded);
    users.findById(decoded.id, { password: "" }, function (err, user) {
      console.log("User",user)
      if (err)
        return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      res.status(200).send(user);
    });
  });
};

exports.login = async function (req, res) {
  users.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
};
