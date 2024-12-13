exports.selectUserBookings = `
                    WITH CheckUser AS (
                          SELECT 1 
                          FROM users 
                          WHERE user_id = $1
                    ),
                    UserData AS ( SELECT booking_id, check_in_date, check_out_date, b.property_id,
                    p.name AS property_name, 
                    CONCAT(first_name, ' ', surname) AS host,
                    (SELECT image_url FROM images i where i.property_id = b.property_id order by image_id limit 1) AS image 
                    FROM bookings b JOIN properties p
                    ON b.property_id = p.property_id
                    JOIN users u
                    ON b.guest_id = u.user_id 
                    WHERE guest_id = $1
                    ORDER BY booking_id)
                    SELECT 
                          CASE 
                            WHEN EXISTS (SELECT * FROM CheckUser) THEN 
                              json_build_object(
                                'bookings', COALESCE(json_agg(ROW_TO_JSON(UserData)), '[]'::json)
                            )
                            ELSE 
                            json_build_object(
                              'error-msg','No bookings found.'
                            )
                          END AS result
                        FROM UserData;`;

exports.selectPropertyBookings = `  WITH CheckProperty AS (
                                        SELECT 1 
                                        FROM properties 
                                        WHERE property_id = $1
                                  ),
                                  BookingData AS ( SELECT  booking_id, check_in_date,
                                  check_out_date, created_at 
                                  FROM 
                                  bookings b
                                  WHERE
                                  b.property_id = $1 )
                                   SELECT 
                                    CASE 
                                      WHEN EXISTS (SELECT * FROM CheckProperty) THEN 
                                        json_build_object(
                                          'bookings', COALESCE(json_agg(ROW_TO_JSON(BookingData)), '[]'::json),
                                          'property_id', $1
                                      )
                                      ELSE 
                                       json_build_object(
                                          'error-msg', 'No bookings yet.'
                                      )
                                    END AS result
                                  FROM BookingData; `;
