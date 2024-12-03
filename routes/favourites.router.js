const express = require("express");
const favouritesRouter = express.Router({ mergeParams: true });
const {
  postFavourite,
  deleteFavourite,
} = require("../controllers/favouritecontroller");
const { handleMethodNotAllowed } = require("../server/error");

favouritesRouter
  .route("/")
  .post(postFavourite)
  .delete(deleteFavourite)
  .all(handleMethodNotAllowed);

module.exports = favouritesRouter;
