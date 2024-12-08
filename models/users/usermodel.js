const db = require("../../db/connection");
const { selectUser } = require("../users/select-query");

exports.fetchUserById = async (user_id) => {
  const { rows: user } = await db.query(selectUser, [user_id]);
  if (user.length === 0) {
    return Promise.reject({ status: 404, msg: "No record found." });
  }
  return user[0];
};

exports.updateUser = async (
  { first_name, surname, email, phone, avatar },
  user_id
) => {
  const queryStr = `UPDATE users SET
                      first_name = COALESCE($1, first_name),
                      surname = COALESCE($2, surname),
                      email =  COALESCE($3, email),
                      phone_number =  COALESCE($4, phone_number),
                      avatar =  COALESCE($5, avatar)
                      WHERE
                      user_id = $6 RETURNING *`;
  const values = [first_name, surname, email, phone, avatar, user_id];
  const { rows: updatedUser } = await db.query(queryStr, values);
  if (updatedUser.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "user doesn't exist, no record updated.",
    });
  }
  return updatedUser[0];
};

exports.insertUser = async ({
  first_name,
  surname,
  email,
  phone,
  role,
  avatar,
}) => {
  const queryStr =
    "INSERT INTO users (first_name, surname, email, phone_number, role, avatar) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
  const values = [first_name, surname, email, phone, role, avatar];

  const { rows: insertedUser } = await db.query(queryStr, values);
  return insertedUser[0];
};
