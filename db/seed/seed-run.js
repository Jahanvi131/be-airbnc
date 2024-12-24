const ENV = process.env.NODE_ENV || "development";
const data = require(`../data/${ENV}/index.js`);
const seed = require("../seed/seed.js");
const db = require("../connection");

seed(data)
  .then(() => {
    db.end();
  })
  .catch((error) => {
    console.log("Seeding failed:", error);
    db.end();
  });
