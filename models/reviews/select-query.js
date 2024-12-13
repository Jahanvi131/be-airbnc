exports.selectReviews = ` WITH CheckProperty AS (
                          SELECT 1 
                          FROM properties 
                          WHERE property_id = $1
                        ),
                        ReviewData AS (
                          SELECT 
                            r.review_id,
                            r.comment,
                            r.rating,
                            r.created_at,
                            CONCAT(u.first_name, ' ', u.surname) AS guest,
                            u.avatar AS guest_avatar
                          FROM 
                            reviews r
                          JOIN 
                            users u
                          ON 
                            r.guest_id = u.user_id
                          WHERE 
                            r.property_id = $1
                          ORDER BY
                            r.created_at DESC
                        )
                        SELECT 
                          CASE 
                            WHEN EXISTS (SELECT * FROM CheckProperty) THEN 
                              json_build_object(
                                'reviews', COALESCE(json_agg(ROW_TO_JSON(ReviewData)), '[]'::json),
                                'average_rating', (SELECT AVG(rating)::float FROM reviews WHERE property_id = $1)
                              )
                            ELSE 
                            json_build_object(
                              'error-msg','No record found.'
                            )
                          END AS result
                        FROM ReviewData;`;
