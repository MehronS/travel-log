const express = require("express");
const router = express.Router();
const axios = require("axios");
const { User, Location, PictureAtLocation } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = router;

// Token Middleware Function
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id;

    next();
  });
};

// /api/users/create

router.route(`/create`).post(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    // generate token
    const user = { email: newUser.email, id: newUser.id };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.setHeader("authorization", accessToken).send(newUser);
  } catch (error) {
    next(error);
  }
});

// /api/users/:id/pictures
router
  .route("/:id/pictures")
  .put(authenticateToken, async (req, res, next) => {
    try {
      const userLocationPics = await PictureAtLocation.findAll({
        where: {
          userId: req.userId,
          locationName: req.body.locationName,
        },
      });

      res.send(userLocationPics);
    } catch (error) {
      console.error(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      const location = await Location.findByPk(req.body.locationName);
      const image = await PictureAtLocation.findOrCreate({
        where: { imageUrl: req.body.imageUrl },
      });

      await user.addPictureAtLocations(image[0]);
      await location.addPictureAtLocations(image[0]);

      const userLocationPics = await PictureAtLocation.findAll({
        where: { userId: req.params.id, locationName: req.body.locationName },
      });

      res.send(userLocationPics);
    } catch (error) {
      next(error);
    }
  });

// AUTHENTICATION
// New Users password hashed in the class hook

// /api/users/login

router.post(`/login`, async (req, res, next) => {
  try {
    const [findUser] = await User.findAll({
      where: { email: req.body.email },
      include: [{ model: Location }],
    });

    if (!findUser) res.status(400).send(`Cannot Find User`);
    else if (await bcrypt.compare(req.body.password, findUser.password)) {
      findUser.password = `none of your business`;

      // generate token
      const user = { email: findUser.email, id: findUser.id };

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      res.setHeader("authorization", accessToken).send(findUser);
    } else {
      res.send(`Not Allowed`);
    }
  } catch (error) {
    next(error);
  }
});

// /api/users/:id
router.get(`/:id`, authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: Location,
          // fun with nested includes to pinpoint specific pictures and users
          // include: [
          //   { model: PictureAtLocation, where: { userId: req.params.id } },
          // ],
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
