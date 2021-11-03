const db = require("./database");
const User = require("./user");
const Location = require("./location");
const PictureAtLocation = require("./picturesAtLocations");

User.belongsToMany(Location, {
  through: `beenToPlaces`,
});

Location.belongsToMany(User, {
  through: `beenToPlaces`,
});

User.hasMany(PictureAtLocation);
PictureAtLocation.belongsTo(User);

Location.hasMany(PictureAtLocation);
PictureAtLocation.belongsTo(Location);

db.sync();

module.exports = {
  db,
  User,
  Location,
  PictureAtLocation,
};
