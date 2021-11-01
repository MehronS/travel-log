const Sequelize = require("sequelize");
const db = require("./database");

const Location = db.define("location", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Location;
