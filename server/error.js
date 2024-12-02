exports.handlePageNotFound = (req, res) => {
  res.status(404).send({ msg: "page not found" });
};

exports.handleMethodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send("Internal Server Error");
};
