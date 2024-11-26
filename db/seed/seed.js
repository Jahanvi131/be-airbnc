const manageTables = require("../seed/manage-tables");

const seed = async () => {
  try {
    await manageTables();
  } catch (err) {}
};

module.exports = seed;
