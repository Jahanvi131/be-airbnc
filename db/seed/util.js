exports.createRef = (key, value, data) => {
  return data.reduce((refObj, row) => {
    refObj[row[key]] = row[value];
    return refObj;
  }, {});
};

exports.formatData = (refObj, keyToRemove, keyToAdd, rawData) => {
  return rawData.map(({ [keyToRemove]: removedKey, ...row }) => {
    return {
      ...row,
      [keyToAdd]: refObj[[removedKey]] || null, // Add new key
    };
  });
};

exports.formatDatas = (refObjs, keysToRemove, keysToAdd, rawData) => {
  return rawData.map((row) => {
    return keysToRemove.reduce(
      (updatedRow, keyToRemove, index) => {
        const keyToAdd = keysToAdd[index];
        const refObj = refObjs[index];

        if (keyToRemove in updatedRow) {
          const { [keyToRemove]: removedKey, ...rest } = updatedRow;
          return {
            ...rest,
            [keyToAdd]: refObj[[removedKey]] || null, // Add new key
          };
        }
      },
      { ...row }
    );
  });
};

exports.formatPropertyTypes = (propertyTypes) => {
  return propertyTypes.map(({ property_type, description }) => [
    property_type,
    description,
  ]);
};

exports.formatUsers = (users) => {
  return users.map(
    ({ first_name, surname, email, phone_number, role, avatar }) => [
      first_name,
      surname,
      email,
      phone_number,
      role,
      avatar,
    ]
  );
};

exports.combineNames = (users) => {
  return users.map(({ first_name, surname, ...rest }) => {
    return {
      host_name: [first_name, surname].join(" "),
      ...rest,
    };
  });
};

exports.formatProperties = (properties) => {
  return properties.map(
    ({
      host_id,
      name,
      location,
      property_type,
      price_per_night,
      description,
    }) => [host_id, name, location, property_type, price_per_night, description]
  );
};

exports.formatFavourites = (favourites) => {
  return favourites.map(({ guest_id, property_id }) => [guest_id, property_id]);
};

exports.formatReviews = (reviews) => {
  return reviews.map(({ property_id, guest_id, rating, comment }) => [
    property_id,
    guest_id,
    rating,
    comment,
  ]);
};
