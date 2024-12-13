const express = require("express");
const propertiesRouter = express.Router();
const favouritesRouter = require("../routes/favourites.router");
const reviewsRouter = require("../routes/reviews.router");
const bookingsRouter = require("../routes/booking.router");

const {
  getProperties,
  getPropertyById,
  postProperty,
  deleteProperty,
  patchProperty,
} = require("../controllers/propertycontroller");

propertiesRouter.use("/:id/favourite", favouritesRouter);

propertiesRouter.use("/:id/reviews", reviewsRouter);

propertiesRouter.use("/:id/bookings", bookingsRouter);

propertiesRouter.route("/").get(getProperties).post(postProperty);

propertiesRouter
  .route("/:id")
  .get(getPropertyById)
  .delete(deleteProperty)
  .patch(patchProperty);

module.exports = propertiesRouter;
