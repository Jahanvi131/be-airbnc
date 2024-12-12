const express = require("express");
const {
  postBooking,
  patchBooking,
  deleteBooking,
} = require("../controllers/bookingcontroller");

const bookingsRouter = express.Router({ mergeParams: true });

bookingsRouter.route("/").post(postBooking);

bookingsRouter.route("/:id").patch(patchBooking).delete(deleteBooking);

module.exports = bookingsRouter;
