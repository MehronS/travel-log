const Sequelize = require("sequelize");
const db = require("./database");

const Location = db.define("location", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
  },
  // not used for now. Will implement or remove at a later time
  rating: {
    type: Sequelize.INTEGER,
    defaultValue: 5,
  },

  locationInfo: {
    type: Sequelize.TEXT,
  },
});

module.exports = Location;
