const User = require("../../3380NazaninBinesh-data/userDb");

exports.registerUser = async function (req, res) {
  await User.create(
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
      password: req.body.password,
    },
    function (err, user) {     
      if (err)
        return res
          .status(500)
          .send("There was a problem adding the information to the database.");
      res.status(200).send(user);
    }
  );
};

exports.getUsers = async function (req, res) {
  await User.find({}, function (err, users) {
    if (err)
      return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(users);
  });
};

exports.getSingleUser = async function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err)
      return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });
};

exports.deleteUser = async function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err)
      return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User: " + user.name + " was deleted.");
  });
};

exports.updateUser = async function (req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    function (err, user) {
      if (err)
        return res.status(500).send("There was a problem updating the user.");
      res.status(200).send(user);
    }
  );
};
