const express = require("express");
const router = express.Router();
const axios = require("axios");
const { User, Location, useThis } = require("../db");
const bcrypt = require("bcrypt");

module.exports = router;

// /api/users

router.route(`/`).post(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

// /api/users/login
router.post(`/login`, async (req, res, next) => {
  try {
    console.log(`from api`, req.body);
    const [findUser] = await User.findAll({
      where: { email: req.body.email },
      include: [{ model: Location }],
    });

    if (!findUser) res.status(400).send(`Cannot Find User`);
    else if (await bcrypt.compare(req.body.password, findUser.password)) {
      delete findUser.password;
      res.send(findUser);
    } else {
      res.send(`Not Allowed`);
    }
  } catch (error) {
    next(error);
  }
});

// /api/users/:id
router.get(`/:id`, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Location,
        },
      ],
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// /api/users/:ccn3
router.route(`/:ccn3`).post(async (req, res, next) => {
  try {
    const singleCountry = await axios.get(
      `https://restcountries.com/v3.1/alpha/${req.params.ccn3}`
    );
    singleCountry.data[0].name = singleCountry.data[0].name.common;

    const newLocation = await Location.findOrCreate({
      where: { name: singleCountry.data[0].name },
    });

    const getUser = await User.findByPk(req.body.id);
    const updateUser = await getUser.addLocations(newLocation[0]);
    res.send(updateUser);
  } catch (error) {
    next(error);
  }
});

// error handling middleware
router.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});
