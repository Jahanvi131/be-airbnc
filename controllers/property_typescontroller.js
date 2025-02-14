const {
  fetchPropertyTypes,
} = require("../models/property_types/property_typesmodel");

exports.getPropertyTypes = (req, res, next) => {
  fetchPropertyTypes()
    .then((property_types) => {
      {
        res.send({ property_types });
      }
    })
    .catch(next);
};
