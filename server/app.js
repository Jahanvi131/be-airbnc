const express = require("express");
const apiRouter = require("../routes/api.router");
const {
  handlePageNotFound,
  handleCustomErrors,
  handleBadRequestErrors,
  handleNoRecordFoundErrors,
  handleServerErrors,
} = require("./error/set-error-response");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handlePageNotFound);

app.use(handleNoRecordFoundErrors);

app.use(handleBadRequestErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
