const Sequelize = require("sequelize");
const db = require("./database");
const bcrypt = require("bcrypt");

const User = db.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
    },
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

User.addHook("beforeCreate", async (user) => {
  try {
    const salt = await bcrypt.genSalt(10);
    // added .toString just in case the password comes through as an integer (like in the seed)
    const hash = await bcrypt.hash(user.password.toString(), salt);
    user.password = hash;
  } catch (error) {
    console.error(error);
  }
});

module.exports = User;
