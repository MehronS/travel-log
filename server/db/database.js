const Sequelize = require("sequelize");

// (
//   process.env.DATABASE_URL || "postgres://localhost:5432/travel_guide",
//   {
//     logging: false,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   }
// );

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/travel_guide",
  {
    protocol: null,
    logging: false,
  }
);

module.exports = db;
