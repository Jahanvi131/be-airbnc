const { Pool } = require("pg");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";

const config = {};

require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const pool = new Pool(config);
module.exports = pool;
