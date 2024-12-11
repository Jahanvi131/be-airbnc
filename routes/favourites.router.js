const express = require("express");
const favouritesRouter = express.Router({ mergeParams: true });
const {
  postFavourite,
  deleteFavourite,
} = require("../controllers/favouritecontroller");
const {
  handleMethodNotAllowed,
} = require("../server/error/set-error-response");

favouritesRouter.route("/").post(postFavourite);

favouritesRouter
  .route("/:id")
  .delete(deleteFavourite)
  .all(handleMethodNotAllowed);

module.exports = favouritesRouter;
