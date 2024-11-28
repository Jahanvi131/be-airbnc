const manageTables = require("../seed/manage-tables");
const {
  seedPropertyTypes,
  seedUsers,
  seedProperties,
  seedfavourites,
  seedReviews,
} = require("../seed/seed-tables");

const seed = async ({
  propertyTypesData,
  usersData,
  propertiesData,
  favouritesData,
  reviewsData,
}) => {
  try {
    await manageTables(); // creating and dropping tables

    await seedPropertyTypes(propertyTypesData);

    const { rows: insertedUsers } = await seedUsers(usersData);

    const { rows: insertedProperties } = await seedProperties(
      propertiesData,
      insertedUsers
    );

    await seedfavourites(favouritesData, insertedUsers, insertedProperties);

    await seedReviews(reviewsData, insertedUsers, insertedProperties);
  } catch (err) {
    console.log(
      `Error: somethig went wrong while seeding database tables - ${err}`
    );
  }
};

module.exports = seed;
