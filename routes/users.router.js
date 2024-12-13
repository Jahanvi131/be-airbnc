const express = require("express");
const {
  getUserById,
  patchUser,
  postUser,
} = require("../controllers/usercontroller");
const { getUserBookings } = require("../controllers/bookingcontroller");
const {
  handleMethodNotAllowed,
} = require("../server/error/set-error-response");

const usersRouter = express.Router();

usersRouter.route("/").post(postUser);

usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(patchUser)
  .all(handleMethodNotAllowed);

usersRouter.route("/:id/bookings").get(getUserBookings);

module.exports = usersRouter;
