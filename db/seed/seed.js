const manageTables = require("../seed/manage-tables");
const {
  seedPropertyTypes,
  seedUsers,
  seedProperties,
  seedImages,
  seedfavourites,
  seedReviews,
  seedBookings,
} = require("../seed/seed-tables");

const seed = async ({
  propertyTypesData,
  usersData,
  propertiesData,
  favouritesData,
  reviewsData,
  imagesData,
  bookingsData,
}) => {
  try {
    await manageTables(); // creating and dropping tables

    // inserting tables data
    await seedPropertyTypes(propertyTypesData);

    const { rows: insertedUsers } = await seedUsers(usersData);

    const { rows: insertedProperties } = await seedProperties(
      propertiesData,
      insertedUsers
    );

    await seedImages(imagesData, insertedProperties);

    await seedfavourites(favouritesData, insertedUsers, insertedProperties);

    await seedReviews(reviewsData, insertedUsers, insertedProperties);

    await seedBookings(bookingsData, insertedUsers, insertedProperties);
  } catch (err) {
    console.log(
      `Error: somethig went wrong while seeding database tables - ${err}`
    );
  }
};

module.exports = seed;
