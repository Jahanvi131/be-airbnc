const db = require("../db/connection");

exports.fetchProperties = async (options = {}) => {
  try {
    const { maxprice, minprice, sort = "name", order = "asc", host } = options;
    const values = [];
    const validSortBy = ["price_per_night", "name"];
    const validSortByOrder = ["asc", "desc"];

    if (!validSortBy.includes(sort) || !validSortByOrder.includes(order)) {
      return Promise.reject({
        status: 400,
        msg: "Oops! Invalid either sort or order.",
      });
    }

    let queryStr = `SELECT property_id, name as property_name,
                      location, price_per_night::float,
                      CONCAT(first_name, ' ', surname) AS host
                      FROM properties p JOIN users u ON
                      p.host_id = u.user_id `;

    if (Object.keys(options).length > 0 && (maxprice || minprice || host))
      queryStr += "WHERE ";

    if (maxprice) {
      values.push(maxprice);
      queryStr += `price_per_night >= $${values.length} `;
    }

    if (minprice) {
      if (values.length) {
        queryStr += "AND ";
      }
      values.push(minprice);
      queryStr += `price_per_night < $${values.length} `;
    }

    if (host) {
      if (values.length) {
        queryStr += "AND ";
      }
      values.push(host);
      queryStr += `host_id = $${values.length} `;
    }

    queryStr += `ORDER BY ${sort} ${order}`;

    const { rows } = await db.query(queryStr, values);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "no record found." });
    }
    return rows;
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({ status: 400, msg: "Bad Request." });
    }
  }
};

exports.insertProperty = async ({
  name,
  property_type,
  location,
  price_per_night,
  description,
  host_id,
}) => {
  try {
    const queryStr =
      "INSERT INTO properties (name, property_type, location, price_per_night, description, host_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [
      name,
      property_type,
      location,
      price_per_night,
      description,
      host_id,
    ];

    const { rows: insertedProperty } = await db.query(queryStr, values);
    return insertedProperty[0];
  } catch (err) {
    return Promise.reject({ status: 400, msg: "Bad Request." });
  }
};

exports.deleteProperty = async (property_id) => {
  try {
    const queryStr =
      "DELETE FROM properties WHERE property_id = $1 RETURNING *";
    const { rows } = await db.query(queryStr, [property_id]);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "property doesn't exist." });
    }
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({ status: 400, msg: "Invalid Id." });
    }
  }
};

exports.updateProperty = async (
  property_id,
  { property_name, property_type, location, price_per_night, description }
) => {
  try {
    const queryStr = `UPDATE properties SET
                      name=$1,
                      property_type=$2,
                      location=$3, 
                      price_per_night=$4,
                      description=$5
                      WHERE
                      property_id=$6 RETURNING *`;
    const values = [
      property_name,
      property_type,
      location,
      price_per_night,
      description,
      property_id,
    ];
    const { rows: updatedProperty } = await db.query(queryStr, values);
    if (updatedProperty.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "property doesn't exist, no record updated.",
      });
    }
    return updatedProperty[0];
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({ status: 400, msg: "Invalid Id." });
    }
    return Promise.reject({ status: 400, msg: "Bad Request." });
  }
};
