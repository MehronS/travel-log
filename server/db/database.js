const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/travel_guide",
  {
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  }
);

module.exports = db;
