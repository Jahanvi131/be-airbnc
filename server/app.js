const express = require("express");
const apiRouter = require("../routes/api.router");
const {
  handlePageNotFound,
  handleCustomErrors,
  handleServerErrors,
} = require("../server/error");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handlePageNotFound);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
