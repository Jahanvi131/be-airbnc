const express = require("express");
const propertiesRouter = express.Router();
const favouritesRouter = require("../routes/favourites.router");
const {
  getProperties,
  postProperty,
  deleteProperty,
  patchProperty,
} = require("../controllers/propertycontroller");

propertiesRouter.use("/:id/favourite", favouritesRouter);

propertiesRouter.route("/").get(getProperties).post(postProperty);

propertiesRouter
  .route("/:property_id")
  .delete(deleteProperty)
  .patch(patchProperty);

module.exports = propertiesRouter;
