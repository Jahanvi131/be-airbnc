const db = require("../connection");
const {
  dropReviews,
  dropFavourites,
  dropProperties,
  dropUsers,
  dropPropertyTypes,
  dropImages,
  createReviews,
  createFavourites,
  createProperties,
  createUsers,
  createPropertyTypes,
  createImages,
} = require("../seed/manage-table-queries");

const manageTables = async () => {
  // drop tables
  try {
    await db.query(dropReviews);
    await db.query(dropFavourites);
    await db.query(dropImages);
    await db.query(dropProperties);
    await Promise.all([db.query(dropUsers), db.query(dropPropertyTypes)]);

    // create tables
    await Promise.all([db.query(createPropertyTypes), db.query(createUsers)]);
    await db.query(createProperties);
    await db.query(createImages);
    await db.query(createFavourites);
    await db.query(createReviews);
  } catch (err) {
    console.log(`Error in creating or dropping tables:${err}`);
  }
};

module.exports = manageTables;
