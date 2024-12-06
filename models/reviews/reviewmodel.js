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
