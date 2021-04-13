const users = require("../../3380NazaninBinesh-data/userTbl");
const products = require("../../3380NazaninBinesh-data/productTbl");

//Add in bcrypt, jsonwebtoken, source the config file
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config");

async function checkUserEmailAvailability(email){  
   return users.find({"email":email }, (err, user)=> {  
    if (err){     
      return res.send("There was a problem registering the user.");  
    }        
    return(user.length >=1 );
  });

}

exports.registerUser = async function (req, res) {

  var today = new Date();
  var currentYear = today.getFullYear();
  var birthDate = new Date(req.body.birthDate);
  var userBirthYear = birthDate.getFullYear();
  


  if (currentYear - userBirthYear < 18) {  
    return res.send({ underAge: true });
  }

  var userAvailabilityCheck =  await checkUserEmailAvailability(req.body.email);  
  if(userAvailabilityCheck.length >=1 ){   
    
    return res.send({ emailExist: true });
  }
    
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
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
        res.status(200).send({ userId: user._id });
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
      console.log("User", user);
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

    var token = jwt.sign(
      { id: user._id, username: user.firstName + " " + user.lastName },
      config.secret,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    res.status(200).send({ auth: true, token: token });
  });
};

exports.addProduct = async function (req, res) {
  products.create(
    {
      productName: req.body.productName,
      productImage: req.body.productImage,
      productDescription: req.body.productDescription,
      productCondition: req.body.productCondition,
      productPrice: req.body.productPrice,
      productStatus: req.body.productStatus,
      productOwner: req.body.productOwner,
    },

    function (err, products) {
      if (err)
        return res.status(500).send("There was a problem adding the product.");
      res.status(200).send(products);
    }
  );
};

exports.products = async function (req, res) {
  products.find(
    { productOwner: req.body.productOwner },
    function (err, products) {
      if (err)
        return res
          .status(500)
          .send("There was a problem finding the products.");
      if (!products) return res.status(404).send("No Product found.");
      res.status(200).send(products);
    }
  );
};

exports.deleteProduct = async function (req, res) {
  products.findByIdAndRemove(req.params.id, function (err, product) {
    if (err)
      return res.status(500).send("There was a problem deleting the product.");

    //res.status(200).send(products);
  });
  res.status(200).send({ products: products });
};


exports.updateProduct = async function (req, res) {
  products.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    function (err, product) {
      if (err)
        return res.status(500).send("There was a problem updating the user.");
      res.status(200).send(product);
    }
  );
};

exports.getProduct = async function (req, res) {
  products.findById(
    req.params.id,       
    function (err, product) {     
      if (err)
        return res.status(500).send("There was a problem updating the Product.");
      res.status(200).send(product);
    }
  );
};