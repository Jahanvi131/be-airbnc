const db = require("../../db/connection");
const {
  selectProperties,
  selectPropertyById,
} = require("../properties/select-query");

exports.fetchProperties = async (options = {}) => {
  const { sort = "popularity", order = "asc" } = options;
  const { query, values } = selectProperties(options);

  const validSortBy = ["price_per_night", "name", "popularity"];
  const validSortByOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort) || !validSortByOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Oops! Invalid either sort or order.",
    });
  }

  const { rows } = await db.query(query, values);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No record found." });
  }
  return rows;
};

exports.insertProperty = async ({
  name,
  property_type,
  location,
  price_per_night,
  description,
  host_id,
}) => {
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
};

exports.deleteProperty = async (property_id) => {
  const queryStr = "DELETE FROM properties WHERE property_id = $1 RETURNING *";
  const { rows } = await db.query(queryStr, [property_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "property doesn't exist, no record deleted.",
    });
  }
};

exports.updateProperty = async (
  property_id,
  { property_name, property_type, location, price_per_night, description }
) => {
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
};

exports.fetchPropertyById = async (property_id, user_id) => {
  const { query, values } = selectPropertyById(property_id, user_id);

  const { rows: property } = await db.query(query, values);

  if (property.length === 0) {
    return Promise.reject({ status: 404, msg: "No record found." });
  }
  return property[0];
};
