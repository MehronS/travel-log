const db = require("./database");
const User = require("./user");
const Location = require("./location");

User.belongsToMany(Location, {
  through: `beenToPlaces`,
});

Location.belongsToMany(User, {
  through: `beenToPlaces`,
});

db.sync();

module.exports = {
  db,
  User,
  Location,
};
