exports.isValidDate = (check_in_date, check_out_date) => {
  // Convert the inputs to Date objects
  const checkInDate = new Date(check_in_date);
  const checkOutDate = new Date(check_out_date);

  // Validate that both dates are valid
  const isValidCheckIn = !isNaN(checkInDate.getTime());
  const isValidCheckOut = !isNaN(checkOutDate.getTime());

  // Return true if both dates are valid, otherwise false
  return isValidCheckIn && isValidCheckOut;
};
