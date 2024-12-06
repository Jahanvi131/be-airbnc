exports.selectUser = `SELECT user_id,first_name,
                           surname,email,
                           phone_number,avatar,
                           created_at::timestamptz FROM users
                           WHERE user_id = $1`;
