const Sequelize = require("sequelize");
const db = require("./database");

const PictureAtLocation = db.define("pictureAtLocation", {
  imageUrl: {
    type: Sequelize.STRING,
  },

  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = PictureAtLocation;
