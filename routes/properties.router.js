const express = require("express");
const propertiesRouter = express.Router();
const {
  getProperties,
  postProperty,
  deleteProperty,
  patchProperty,
} = require("../controllers/propertycontroller");

propertiesRouter.route("/").get(getProperties).post(postProperty);

propertiesRouter
  .route("/:property_id")
  .delete(deleteProperty)
  .patch(patchProperty);

module.exports = propertiesRouter;
