const express = require("express");
const propertiesRouter = require("../routes/properties.router");
const favouritesRouter = require("../routes/favourites.router");
const reviewsRouter = require("../routes/reviews.router");
const usersRouter = require("../routes/users.router");

const apiRouter = express.Router();

apiRouter.use("/properties", propertiesRouter);

apiRouter.use("/favourites", favouritesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
