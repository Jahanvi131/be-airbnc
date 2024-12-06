const db = require("../../db/connection");
const { resource } = require("../../server/app");
const { selectReviews } = require("../reviews/select-query");

exports.fetchReviews = async (property_id) => {
  const queryStr = selectReviews;
  const {
    rows: [{ result }],
  } = await db.query(queryStr, [property_id]);

  if (result.hasOwnProperty(["property-id"])) {
    return Promise.reject({ status: 404, msg: "No record found." });
  }
  return result;
};

exports.insertReview = async (review, property_id) => {
  const { guest_id, rating, comment } = review;
  const queryStr =
    "INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES($1, $2, $3, $4) RETURNING *";
  const values = [property_id, guest_id, rating, comment];

  const { rows: insertedReview } = await db.query(queryStr, values);

  return insertedReview[0];
};

exports.deleteReview = async (review_id) => {
  const queryStr = "DELETE FROM reviews WHERE review_id = $1 RETURNING *";
  const { rows } = await db.query(queryStr, [review_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "property's review doesn't exist, no record deleted.",
    });
  }
};
