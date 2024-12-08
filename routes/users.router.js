const express = require("express");
const {
  getUserById,
  patchUser,
  postUser,
} = require("../controllers/usercontroller");

const usersRouter = express.Router();

usersRouter.route("/").post(postUser);
usersRouter.route("/:id").get(getUserById).patch(patchUser);

module.exports = usersRouter;
