const {
  insertBooking,
  updateBooking,
  deleteBooking,
} = require("../models/bookings/bookingmodel");

exports.postBooking = (req, res, next) => {
  const booking = req.body;
  const { id: property_id } = req.params;

  insertBooking(booking, property_id)
    .then((booking) => {
      res.status(201).send({ booking });
    })
    .catch(next);
};

exports.patchBooking = (req, res, next) => {
  const booking = req.body;
  const { id: booking_id } = req.params;

  updateBooking(booking, booking_id)
    .then((booking) => {
      res.status(200).send({ booking });
    })
    .catch(next);
};

exports.deleteBooking = (req, res, next) => {
  const { id: booking_id } = req.params;

  deleteBooking(booking_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
