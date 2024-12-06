const {
  fetchReviews,
  insertReview,
  deleteReview,
} = require("../models/reviews/reviewmodel");

exports.getReviews = (req, res, next) => {
  const { id: property_id } = req.params;

  fetchReviews(property_id)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const reviewData = req.body;
  const { id: property_id } = req.params;

  insertReview(reviewData, property_id)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

exports.deleteReview = (req, res, next) => {
  const { id: review_id } = req.params;

  deleteReview(review_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
