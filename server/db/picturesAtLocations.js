const Sequelize = require("sequelize");
const db = require("./database");

const PictureAtLocation = db.define("pictureAtLocation", {
  imageUrl: {
    type: Sequelize.STRING,
  },

  // Not utilized yet but will implement later on
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = PictureAtLocation;
