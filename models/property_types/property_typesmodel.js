const db = require("../../db/connection");
const { selectPropertyTypes } = require("../property_types/select-query");

exports.fetchPropertyTypes = async () => {
  const { rows: property_types } = await db.query(selectPropertyTypes);
  return property_types;
};
