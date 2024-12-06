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

reviewsRouter
  .route("/reviews")
  .get(getReviews)
  .post(postReview)
  .all(handleMethodNotAllowed);

reviewsRouter.route("/:id").delete(deleteReview);
module.exports = reviewsRouter;
