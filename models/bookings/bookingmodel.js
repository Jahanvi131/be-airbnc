const db = require("../../db/connection");

exports.insertBooking = async (
  { guest_id, check_in_date, check_out_date },
  property_id
) => {
  const queryStr =
    "INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date) VALUES($1, $2, $3, $4) RETURNING *";
  const values = [property_id, guest_id, check_in_date, check_out_date];

  const { rows: insertedBooking } = await db.query(queryStr, values);
  return {
    booking_id: insertedBooking[0].booking_id,
    msg: "Booking successful",
  };
};
