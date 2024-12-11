// drop tables queries
exports.dropReviews = "DROP TABLE IF EXISTS reviews";

exports.dropFavourites = "DROP TABLE IF EXISTS favourites";

exports.dropProperties = "DROP TABLE IF EXISTS properties";

exports.dropUsers = "DROP TABLE IF EXISTS users";

exports.dropPropertyTypes = "DROP TABLE IF EXISTS property_types";

exports.dropImages = "DROP TABLE IF EXISTS images";

exports.dropBookings = "DROP TABLE IF EXISTS bookings";

// create tables queries
exports.createPropertyTypes = `CREATE TABLE property_types(
                               property_type VARCHAR(50) PRIMARY KEY,
                               description TEXT NOT NULL);`;

exports.createUsers = `CREATE TABLE users(
                        user_id serial PRIMARY KEY,
                        first_name VARCHAR(50) NOT NULL,
                        surname VARCHAR(50) NOT NULL,
                        email VARCHAR(50) NOT NULL,
                        phone_number VARCHAR(15),
                        role VARCHAR(10) CHECK (role IN ('host', 'guest')),
                        avatar VARCHAR(50),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

exports.createProperties = `CREATE TABLE properties(
                             property_id SERIAL PRIMARY KEY,
                             host_id INT NOT NULL REFERENCES users(user_id),
                             name VARCHAR(100) NOT NULL,
                             location VARCHAR(50) NOT NULL,
                             property_type VARCHAR(50) NOT NULL REFERENCES property_types(property_type),
                             price_per_night decimal NOT NULL,
                             description TEXT);`;

exports.createFavourites = `CREATE TABLE favourites(
                             favourite_id SERIAL PRIMARY KEY,
                             guest_id INT NOT NULL REFERENCES users(user_id),
                             property_id INT NOT NULL REFERENCES properties(property_id));`;

exports.createReviews = `CREATE TABLE reviews(
                          review_id SERIAL PRIMARY KEY,
                          property_id INT NOT NULL REFERENCES properties(property_id),
                          guest_id INT NOT NULL REFERENCES users(user_id),
                          rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                          comment TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;

exports.createImages = `CREATE TABLE IMAGES(
                         image_id SERIAL PRIMARY KEY,
                         property_id INT NOT NULL REFERENCES properties(property_id),
                         image_url VARCHAR NOT NULL,
                         alt_text VARCHAR NOT NULL)`;

exports.createBookings = `CREATE TABLE bookings(
                           booking_id SERIAL PRIMARY KEY,
                           property_id INT NOT NULL REFERENCES properties(property_id),
                           guest_id INT NOT NULL REFERENCES users(user_id),
                           check_in_date DATE NOT NULL,
                           check_out_date DATE NOT NULL,
                           created_at TIMESTAMP default CURRENT_TIMESTAMP)`;
