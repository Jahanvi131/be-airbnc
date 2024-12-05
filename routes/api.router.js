const express = require("express");
const propertiesRouter = require("../routes/properties.router");
const favouritesRouter = require("../routes/favourites.router");

const apiRouter = express.Router();

apiRouter.use("/properties", propertiesRouter);

apiRouter.use("/favourites", favouritesRouter);

module.exports = apiRouter;
