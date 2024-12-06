const express = require("express");
const { getUserById } = require("../controllers/usercontroller");

const usersRouter = express.Router();

usersRouter.route("/:id").get(getUserById);

module.exports = usersRouter;
