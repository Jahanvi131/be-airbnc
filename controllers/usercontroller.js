const { fetchUserById } = require("../models/users/usermodel");

exports.getUserById = (req, res, next) => {
  const { id: user_id } = req.params;

  fetchUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
