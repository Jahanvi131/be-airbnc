exports.isValidDate = (input) => {
  const date = new Date(input);

  // Check if the input can be converted to a valid date
  return !isNaN(date.getTime());
};
