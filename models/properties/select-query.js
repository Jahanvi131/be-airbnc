exports.selectProperties = (options = {}) => {
  const { maxprice, minprice, sort = "name", order = "asc", host } = options;
  const values = [];
  let queryStr = `SELECT count(f.favourite_id) as popularity, p.property_id, name as property_name,
                      location, price_per_night::float,
                      CONCAT(first_name, ' ', surname) AS host
                      FROM properties p JOIN users u ON
                      p.host_id = u.user_id
                      JOIN favourites f ON
                      p.property_id = f.property_id `;

  if (Object.keys(options).length > 0 && (maxprice || minprice || host))
    queryStr += "WHERE ";

  if (maxprice) {
    values.push(maxprice);
    queryStr += `price_per_night >= $${values.length} `;
  }

  if (minprice) {
    if (values.length) {
      queryStr += "AND ";
    }
    values.push(minprice);
    queryStr += `price_per_night < $${values.length} `;
  }

  if (host) {
    if (values.length) {
      queryStr += "AND ";
    }
    values.push(host);
    queryStr += `host_id = $${values.length} `;
  }

  queryStr += `GROUP BY p.property_id, host `;
  queryStr += `ORDER BY ${sort} ${order} `;

  return { query: queryStr, values: values };
};

exports.selectPropertyById = (property_id, user_id) => {
  const values = [];
  values.push(property_id);
  let queryStr = `SELECT p.property_id, name AS property_name,
                      location, price_per_night::float, description, 
                      CONCAT(first_name, ' ', surname) AS host,
                      avatar AS host_avatar,
                      count(f.favourite_id)::int AS favourite_count `;

  if (user_id) {
    values.push(user_id);
    queryStr += `,(CASE WHEN EXISTS ( SELECT 1  FROM favourites WHERE guest_id = $2 AND property_id = p.property_id)
                     THEN true
                     ELSE false
                     END) AS favourited `;
  }

  queryStr += `FROM properties p JOIN
                      users u ON p.host_id = u.user_id
                      JOIN favourites f ON
                      p.property_id = f.property_id
                      WHERE p.property_id = $1
                      GROUP BY p.property_id, host, host_avatar`;

  return { query: queryStr, values: values };
};