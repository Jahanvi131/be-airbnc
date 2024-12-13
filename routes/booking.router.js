const express = require("express");
const {
  postBooking,
  patchBooking,
  deleteBooking,
  getPropertyBookings,
} = require("../controllers/bookingcontroller");

const bookingsRouter = express.Router({ mergeParams: true });

bookingsRouter.route("/").post(postBooking).get(getPropertyBookings);

bookingsRouter.route("/:id").patch(patchBooking).delete(deleteBooking);

module.exports = bookingsRouter;
