const {
  insertFavourite,
  deleteFavourite,
  fetchUserFavouriteProperties,
} = require("../models/favourites/favouritemodel");

exports.postFavourite = (req, res, next) => {
  const { guest_id } = req.body;
  const { id: property_id } = req.params;

  insertFavourite(guest_id, property_id)
    .then((favourite) => {
      res.status(201).send({ favourite });
    })
    .catch(next);
};

exports.deleteFavourite = (req, res, next) => {
  const { id: favourite_id } = req.params;
  deleteFavourite(favourite_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getUserFavouriteProperties = (req, res, next) => {
  const { id: user_id } = req.params;
  fetchUserFavouriteProperties(user_id)
    .then((favourites) => {
      res.status(200).send(favourites);
    })
    .catch(next);
};
