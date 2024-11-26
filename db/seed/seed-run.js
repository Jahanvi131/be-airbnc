const seed = require("../seed/seed.js");
const db = require("../connection");

seed().then(() => {
  db.end();
});
