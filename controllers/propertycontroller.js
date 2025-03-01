const {
  fetchProperties,
  fetchPropertyById,
  insertProperty,
  deleteProperty,
  updateProperty,
} = require("../models/properties/propertymodel");

exports.getProperties = (req, res, next) => {
  const query = req.query;
  const userId = req.headers["x-user-id"];

  fetchProperties(query, userId)
    .then((properties) => {
      {
        res.send({ properties });
      }
    })
    .catch(next);
};

exports.postProperty = (req, res, next) => {
  const property = req.body;
  insertProperty(property)
    .then((property) => {
      res.status(201).send({ property });
    })
    .catch(next);
};

exports.deleteProperty = (req, res, next) => {
  const { id: property_id } = req.params;

  deleteProperty(property_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchProperty = (req, res, next) => {
  const { id: property_id } = req.params;
  const property = req.body;

  updateProperty(property_id, property)
    .then((property) => {
      res.status(200).send({ property });
    })
    .catch(next);
};

exports.getPropertyById = (req, res, next) => {
  const { id: property_id } = req.params;
  const { user_id } = req.query;

  fetchPropertyById(property_id, user_id)
    .then((property) => {
      res.status(200).send({ property });
    })
    .catch(next);
};
