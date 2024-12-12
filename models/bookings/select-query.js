exports.selectUserBookings = `SELECT booking_id, check_in_date, check_out_date, b.property_id,
                    p.name AS property_name, 
                    CONCAT(first_name, ' ', surname) AS host,
                    (SELECT image_url FROM images i where i.property_id = b.property_id order by image_id limit 1) AS image 
                    FROM bookings b JOIN properties p
                    ON b.property_id = p.property_id
                    JOIN users u
                    ON b.guest_id = u.user_id 
                    WHERE guest_id = $1
                    ORDER BY booking_id`;
