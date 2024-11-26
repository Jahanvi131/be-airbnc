const db = require("../connection");
const {
  dropReviews,
  dropFavourites,
  dropProperties,
  dropUsers,
  dropPropertyTypes,
  createReviews,
  createFavourites,
  createProperties,
  createUsers,
  createPropertyTypes,
} = require("../seed/manage-table-queries");

const manageTables = async () => {
  // drop tables
  try {
    await db.query(dropReviews);
    await db.query(dropFavourites);
    await db.query(dropProperties);
    await db.query(dropUsers);
    await db.query(dropPropertyTypes);

    // create tables
    await db.query(createPropertyTypes);
    await db.query(createUsers);
    await db.query(createProperties);
    await db.query(createFavourites);
    await db.query(createReviews);
  } catch (err) {
    console.log(`Error in creating or dropping tables:${err}`);
  }
};

module.exports = manageTables;
