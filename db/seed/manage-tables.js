const db = require("../connection");

async function manageTables() {
  await db.query("select * from test");
}
