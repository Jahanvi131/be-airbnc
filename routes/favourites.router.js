const express = require("express");
const favouritesRouter = express.Router({ mergeParams: true });
const {
  postFavourite,
  deleteFavourite,
  getUserFavouriteProperties,
} = require("../controllers/favouritecontroller");
const {
  handleMethodNotAllowed,
} = require("../server/error/set-error-response");

favouritesRouter.route("/").get(getUserFavouriteProperties).post(postFavourite);

favouritesRouter
  .route("/:id")
  .delete(deleteFavourite)
  .all(handleMethodNotAllowed);

module.exports = favouritesRouter;
