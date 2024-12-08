const manageTables = require("../seed/manage-tables");
const {
  seedPropertyTypes,
  seedUsers,
  seedProperties,
  seedImages,
  seedfavourites,
  seedReviews,
} = require("../seed/seed-tables");

const seed = async ({
  propertyTypesData,
  usersData,
  propertiesData,
  favouritesData,
  reviewsData,
  imagesData,
}) => {
  try {
    await manageTables(); // creating and dropping tables

    await seedPropertyTypes(propertyTypesData);

    const { rows: insertedUsers } = await seedUsers(usersData);

    const { rows: insertedProperties } = await seedProperties(
      propertiesData,
      insertedUsers
    );

    await seedImages(imagesData, insertedProperties);

    await seedfavourites(favouritesData, insertedUsers, insertedProperties);

    await seedReviews(reviewsData, insertedUsers, insertedProperties);
  } catch (err) {
    console.log(
      `Error: somethig went wrong while seeding database tables - ${err}`
    );
  }
};

module.exports = seed;
