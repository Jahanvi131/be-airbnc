const express = require("express");
const property_typesRouter = express.Router();
const { getPropertyTypes } = require("../controllers/property_typescontroller");

property_typesRouter.route("/").get(getPropertyTypes);

module.exports = property_typesRouter;
