const db = require("../../db/connection");

exports.insertFavourite = async (guest_id, property_id) => {
  try {
    const queryStr =
      "INSERT INTO favourites (guest_id, property_id) VALUES($1, $2) RETURNING *";
    const values = [guest_id, property_id];

    const { rows: insertedFavourites } = await db.query(queryStr, values);

    return {
      favourite_id: insertedFavourites[0].favourite_id,
      msg: "Property favourited successfully.",
    };
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({
        status: 400,
        msg: "invalid property id passed in url.",
      });
    }
    return Promise.reject({ status: 400, msg: "Bad Request." });
  }
};

exports.deleteFavourite = async (favourite_id) => {
  try {
    const queryStr =
      "DELETE FROM favourites WHERE favourite_id = $1 RETURNING *";
    const { rows } = await db.query(queryStr, [favourite_id]);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "record doesn't exist." });
    }
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({
        status: 400,
        msg: "invalid favourite id passed in url.",
      });
    }
  }
};
