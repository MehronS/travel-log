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
