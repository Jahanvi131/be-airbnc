const express = require("express");
const {
  getReviews,
  postReview,
  deleteReview,
} = require("../controllers/reviewcontroller");
const reviewsRouter = express.Router({ mergeParams: true });
const {
  handleMethodNotAllowed,
} = require("../server/error/set-error-response");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter.route("/:id").delete(deleteReview).all(handleMethodNotAllowed);
module.exports = reviewsRouter;
