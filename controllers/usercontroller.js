const {
  fetchUserById,
  updateUser,
  insertUser,
} = require("../models/users/usermodel");

exports.getUserById = (req, res, next) => {
  const { id: user_id } = req.params;

  fetchUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.patchUser = (req, res, next) => {
  const { id: user_id } = req.params;
  const user = req.body;
  updateUser(user, user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const user = req.body;
  insertUser(user)
    .then((user) => res.status(201).send({ user }))
    .catch(next);
};
