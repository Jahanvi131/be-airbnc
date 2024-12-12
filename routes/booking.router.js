const express = require("express");
const {
  postBooking,
  patchBooking,
  deleteBooking,
  getUserBookings,
} = require("../controllers/bookingcontroller");

const bookingsRouter = express.Router({ mergeParams: true });

bookingsRouter.route("/").post(postBooking).get(getUserBookings);

bookingsRouter.route("/:id").patch(patchBooking).delete(deleteBooking);

module.exports = bookingsRouter;
