const express = require("express");
const { postBooking } = require("../controllers/bookingcontroller");

const bookingRouter = express.Router({ mergeParams: true });

bookingRouter.route("/").post(postBooking);

module.exports = bookingRouter;
