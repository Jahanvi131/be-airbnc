const express = require("express");
const favouritesRouter = express.Router({ mergeParams: true });
const {
  postFavourite,
  deleteFavourite,
} = require("../controllers/favouritecontroller");
const {
  handleMethodNotAllowed,
} = require("../server/error/set-error-response");

favouritesRouter.route("/").post(postFavourite).all(handleMethodNotAllowed);

favouritesRouter.route("/:id").delete(deleteFavourite);

module.exports = favouritesRouter;
