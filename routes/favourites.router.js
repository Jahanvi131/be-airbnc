const express = require("express");
const favouritesRouter = express.Router({ mergeParams: true });
const { postFavourite } = require("../controllers/favouritecontroller");
const { handleMethodNotAllowed } = require("../server/error");

favouritesRouter.route("/").post(postFavourite).all(handleMethodNotAllowed);

module.exports = favouritesRouter;
