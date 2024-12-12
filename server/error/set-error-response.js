exports.handlePageNotFound = (req, res) => {
  res.status(404).send({ msg: "Page not found." });
};

exports.handleMethodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method not allowed." });
};

exports.handleNoRecordFoundErrors = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "foreign key reference not found." });
  } else {
    next(err);
  }
};

exports.handleBadRequestErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    // when invalid data type is given
    res.status(400).send({ msg: "Invalid input type." });
  } else if (err.code === "23502") {
    // violation for not-null constraint
    res.status(400).send({ msg: "Bad request." });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send("Internal Server Error");
};
