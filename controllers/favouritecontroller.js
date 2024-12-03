const { insertFavourite } = require("../models/favourites/favouritemodel");

exports.postFavourite = (req, res, next) => {
  const { guest_id } = req.body;
  const { property_id } = req.params;

  insertFavourite(guest_id, property_id)
    .then((favourite) => {
      res.status(201).send({ favourite });
    })
    .catch(next);
};
