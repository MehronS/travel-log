const express = require("express");
const router = express.Router();
const axios = require("axios");
const { User, Location } = require("../db");
module.exports = router;

// /api/countries

router.route(`/`).get(async (req, res, next) => {
  try {
    const allCountries = await axios.get(`https://restcountries.com/v3.1/all`);
    res.send(allCountries.data);
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

      const updatedUser = await user.addLocations(location[0]);

      const singleCountry = await axios.get(
        `https://restcountries.com/v3.1/name/${req.params.name}`
      );

      res.send(singleCountry.data);
    } catch (error) {
      next(error);
    }
  });

// error handling middleware
router.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});
