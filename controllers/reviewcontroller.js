const { fetchReviews } = require("../models/reviews/reviewmodel");

exports.getReviews = (req, res, next) => {
  const { id: property_id } = req.params;

  fetchReviews(property_id)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};
