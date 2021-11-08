const Sequelize = require("sequelize");

const db = new Sequelize(
  // Database URL also useful for Heroku Deployment
  process.env.DATABASE_URL || "postgres://localhost:5432/travel_guide",
  {
    protocol: null, // helps with setting up heroku
    logging: false,
    native: true, // For SSO with Heroku
  }
);

module.exports = db;
