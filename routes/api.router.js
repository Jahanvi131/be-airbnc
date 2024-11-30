const express = require("express");
const propertiesRouter = require("../routes/properties.router");

const apiRouter = express.Router();

apiRouter.use("/properties", propertiesRouter);

module.exports = apiRouter;
