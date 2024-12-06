const db = require("../../db/connection");
const { selectUser } = require("../users/select-query");

exports.fetchUserById = async (user_id) => {
  const { rows: user } = await db.query(selectUser, [user_id]);
  if (user.length === 0) {
    return Promise.reject({ status: 404, msg: "No record found." });
  }
  return user[0];
};
