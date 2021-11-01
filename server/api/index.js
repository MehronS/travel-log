const router = require("express").Router();

// api

// /api/countries
router.use(`/countries`, require(`./location`));

// /api/users
router.use(`/users`, require(`./users`));

// bad path
router.use(function (req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

module.exports = router;
