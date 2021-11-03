const Sequelize = require("sequelize");
const db = require("./database");

const PictureAtLocation = db.define("pictureAtLocation", {
  imageUrl: {
    type: Sequelize.STRING,
  },
});

module.exports = PictureAtLocation;
