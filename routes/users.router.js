const express = require("express");
const {
  getUserById,
  patchUser,
  postUser,
} = require("../controllers/usercontroller");
const {
  handleMethodNotAllowed,
} = require("../server/error/set-error-response");
const bookingsRouter = require("../routes/booking.router");

const usersRouter = express.Router();

usersRouter.use("/:id/bookings", bookingsRouter);

usersRouter.route("/").post(postUser);

usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(patchUser)
  .all(handleMethodNotAllowed);

module.exports = usersRouter;
