exports.selectFavourites = `WITH CheckUser AS (
                                    SELECT 1 
                                    FROM users 
                                    WHERE user_id = $1
                        ),
                        favourite_Data AS (
                           SELECT p.property_id, name as property_name,
                                location, price_per_night::float,
                                CONCAT(first_name, ' ', surname) AS host,
                                (SELECT image_url as Image FROM images i where i.property_id = p.property_id Order by image_id limit 1) as Image
                                FROM properties p JOIN users u ON
                                p.host_id = u.user_id
                                JOIN favourites f ON
                                p.property_id = f.property_id
                                WHERE
                                f.guest_id = $1
                                ORDER BY
                                f.favourite_id DESC
                        )
                        SELECT 
                          CASE 
                            WHEN EXISTS (SELECT * FROM CheckUser) THEN 
                              json_build_object(
                                'favourites', COALESCE(json_agg(ROW_TO_JSON(favourite_Data)), '[]'::json)                         
                              )
                            ELSE 
                           json_build_object(
                              'error-msg','No record found.'
                            )
                          END AS result
                        FROM favourite_Data;`;
