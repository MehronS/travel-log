const express = require("express");
const router = express.Router();
const { PictureAtLocation } = require("../db");

module.exports = router;

// api/pictures/:id

router.delete(`/:id`, async (req, res, next) => {
  try {
    const pictureToDelete = await PictureAtLocation.findByPk(req.params.id);
    await pictureToDelete.destroy();
    res.send();
  } catch (error) {
    next(error);
  }
});

// error handling middleware
router.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error");
});
