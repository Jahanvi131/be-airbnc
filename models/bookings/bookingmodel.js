const db = require("../../db/connection");
const { isValidDate } = require("../util");

exports.insertBooking = async (
  { guest_id, check_in_date, check_out_date },
  property_id
) => {
  if (
    check_in_date &&
    check_out_date &&
    !isValidDate(check_in_date, check_out_date)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid date format." });
  }

  const queryStr =
    "INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date) VALUES($1, $2, $3, $4) RETURNING *";
  const values = [property_id, guest_id, check_in_date, check_out_date];

  const { rows: insertedBooking } = await db.query(queryStr, values);
  return {
    booking_id: insertedBooking[0].booking_id,
    msg: "Booking successful",
  };
};

exports.updateBooking = async (
  { check_in_date, check_out_date },
  booking_id
) => {
  if (
    check_in_date &&
    check_out_date &&
    !isValidDate(check_in_date, check_out_date)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid date format." });
  }

  const queryStr = `UPDATE bookings SET
                        check_in_date = COALESCE($1, check_in_date),
                        check_out_date = COALESCE($2, check_out_date)                        
                        WHERE
                        booking_id = $3 RETURNING *`;
  const values = [check_in_date, check_out_date, booking_id];

  const { rows: updatedbooking } = await db.query(queryStr, values);
  if (updatedbooking.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "booking doesn't exist, no record updated.",
    });
  }
  return updatedbooking[0];
};

exports.deleteBooking = async (booking_id) => {
  const queryStr = "DELETE FROM bookings WHERE booking_id = $1 RETURNING *";
  const { rows } = await db.query(queryStr, [booking_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "booking doesn't exist, no record deleted.",
    });
  }
};
