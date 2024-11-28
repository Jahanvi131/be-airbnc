const data = require("../data/test/index.js");
const seed = require("../seed/seed.js");
const db = require("../connection");

seed(data).then(() => {
  db.end();
});
