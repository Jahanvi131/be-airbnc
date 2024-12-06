const express = require("express");
const { getReviews } = require("../controllers/reviewcontroller");
const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.route("/").get(getReviews);

module.exports = reviewsRouter;
