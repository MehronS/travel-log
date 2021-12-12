const express = require("express");
const router = express.Router();
const axios = require("axios");
const { User, Location } = require("../db");
module.exports = router;

// /api/countries

router.get(`/`, async (req, res, next) => {
  try {
    const allCountries = await axios.get(`https://restcountries.com/v3.1/all`);
    res.send(allCountries.data);
  } catch (error) {
    next(error);
  }
});

// /api/countries/trip/:name/
router.get(`/trip/:name/`, async (req, res, next) => {
  try {
    const location = await Location.findOrCreate({
      where: { name: req.params.name },
    });

    // To store from limited APIs
    if (location[0].locationInfo === null) {
      const justToGetId = await axios({
        url: `https://api.roadgoat.com/api/v2/destinations/auto_complete?q=${req.params.name}`,
        method: `GET`,
        auth: {
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
        },
      });

      const place = await axios({
        url: `https://api.roadgoat.com/api/v2/destinations/${justToGetId.data.data[0].id}`,
        method: `GET`,
        auth: {
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
        },
      });
      let placeholder = location;
      placeholder.locationInfo = JSON.stringify(place.data);
      const updatedLocation = await location[0].update(placeholder);
      res.send(JSON.parse(updatedLocation.locationInfo));
    } else {
      res.send(JSON.parse(location[0].locationInfo));
    }
  } catch (error) {
    next(error);
  }
});

// api/countries/city/:name
router.post(`/city/:name`, async (req, res, next) => {
  try {
    console.log(`got here`);
    const location = await Location.findOrCreate({
      where: { name: req.params.name },
    });

    // To store from limited APIs
    if (location[0].locationInfo === null) {
      console.log(`new city`);

      const place = await axios({
        url: `https://api.roadgoat.com/api/v2/destinations/${req.body.cityId}`,
        method: `GET`,
        auth: {
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
        },
      });
      let placeholder = location;
      placeholder.locationInfo = JSON.stringify(place.data);
      const updatedLocation = await location[0].update(placeholder);
      res.send(JSON.parse(updatedLocation.locationInfo));
    } else {
      console.log(`old city`);
      res.send(JSON.parse(location[0].locationInfo));
    }
  } catch (error) {
    next(error);
  }
});

// /api/countries/:name
router
  .route(`/:name`)
  .get(async (req, res, next) => {
    try {
      const singleCountry = await axios.get(
        `https://restcountries.com/v3.1/name/${req.params.name}`
      );

      res.send(singleCountry.data);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.body.id, {
        include: [{ model: Location }],
      });
      const location = await Location.findOrCreate({
        where: { name: req.params.name },
      });

      await user.addLocations(location[0]);

      const singleCountry = await axios.get(
        `https://restcountries.com/v3.1/name/${req.params.name}`
      );

      res.send(singleCountry.data);
    } catch (error) {
      next(error);
    }
  });

// /api/countries/

// /api/countries/:name/:userId
router.delete(`/:name/:userId`, async (req, res, next) => {
  try {
    const userLocation = await Location.findByPk(req.params.name);
    await userLocation.removeUser(req.params.userId);
    const user = await User.findByPk(req.params.userId);

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// error handling middleware
router.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});
