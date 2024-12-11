const { insertBooking } = require("../models/bookings/bookingmodel");

exports.postBooking = (req, res, next) => {
  const booking = req.body;
  const { id: property_id } = req.params;

  insertBooking(booking, property_id)
    .then((booking) => {
      res.status(201).send({ booking });
    })
    .catch(next);
};
