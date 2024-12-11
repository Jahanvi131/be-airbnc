const db = require("../connection");
const format = require("pg-format");
const {
  createRef,
  formatPropertyTypes,
  formatUsers,
  formatProperties,
  combineNames,
  formatData,
  formatDatas,
  formatFavourites,
  formatReviews,
  formatimages,
  formatBookings,
} = require("../seed/util");

exports.seedPropertyTypes = async (propertyTypes) => {
  return db.query(
    format(
      `INSERT INTO property_types (property_type, description) VALUES %L RETURNING *`,
      formatPropertyTypes(propertyTypes)
    )
  );
};

exports.seedUsers = async (users) => {
  return db.query(
    format(
      `INSERT INTO users (first_name, surname, email, phone_number, role, avatar) VALUES %L RETURNING *`,
      formatUsers(users)
    )
  );
};

exports.seedProperties = async (properties, users) => {
  const newUsers = combineNames(users);
  const usersRef = createRef("host_name", "user_id", newUsers);

  const propertiesData = formatData(
    usersRef,
    "host_name",
    "host_id",
    properties
  );
  return db.query(
    format(
      `INSERT INTO properties
       (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
      formatProperties(propertiesData)
    )
  );
};

exports.seedImages = async (images, properties) => {
  const propertiesRef = createRef("name", "property_id", properties);

  const imagesData = formatData(
    propertiesRef,
    "property_name",
    "property_id",
    images
  );

  return db.query(
    format(
      `INSERT INTO images
       (property_id, image_url, alt_text) VALUES %L RETURNING *`,
      formatimages(imagesData)
    )
  );
};

exports.seedfavourites = async (favourites, users, properties) => {
  const newUsers = combineNames(users);
  const usersRef = createRef("host_name", "user_id", newUsers);
  const propertiesRef = createRef("name", "property_id", properties);

  const favouritesData = formatDatas(
    [usersRef, propertiesRef],
    ["guest_name", "property_name"],
    ["guest_id", "property_id"],
    favourites
  );

  return db.query(
    format(
      `INSERT INTO favourites
       (guest_id, property_id) VALUES %L RETURNING *`,
      formatFavourites(favouritesData)
    )
  );
};

exports.seedReviews = async (reviews, users, properties) => {
  const newUsers = combineNames(users);
  const usersRef = createRef("host_name", "user_id", newUsers);
  const propertiesRef = createRef("name", "property_id", properties);

  const reviewsData = formatDatas(
    [usersRef, propertiesRef],
    ["guest_name", "property_name"],
    ["guest_id", "property_id"],
    reviews
  );

  return db.query(
    format(
      `INSERT INTO reviews
       (property_id, guest_id, rating, comment) VALUES %L RETURNING *`,
      formatReviews(reviewsData)
    )
  );
};

exports.seedBookings = async (bookings, users, properties) => {
  const newUsers = combineNames(users);
  const usersRef = createRef("host_name", "user_id", newUsers);
  const propertiesRef = createRef("name", "property_id", properties);

  const bookingsData = formatDatas(
    [usersRef, propertiesRef],
    ["guest_name", "property_name"],
    ["guest_id", "property_id"],
    bookings
  );

  return db.query(
    format(
      `INSERT INTO bookings
       (property_id, guest_id, check_in_date, check_out_date) VALUES %L RETURNING *`,
      formatBookings(bookingsData)
    )
  );
};
