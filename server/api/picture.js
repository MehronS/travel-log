const express = require("express");
const router = express.Router();
const { PictureAtLocation, User, Location } = require("../db");
const multer = require(`multer`);

module.exports = router;

//Configuration for Multer
// const upload = multer({ dest: "public/files" });

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  let fileType = file.mimetype.split("/")[1];
  if (
    fileType === "jpeg" ||
    fileType === "png" ||
    fileType === "jpg" ||
    fileType === "gif" ||
    fileType === "svg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not an JPEG, GIF, JPG, SVG or PNG File!!"), false);
  }
};

// Calling the "multer" function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: `3000000` }, // 3mbs
});

// /api/pictures/:location/:userId

router
  .route(`/:locationName/:userId`)
  .post(upload.array(`images`, 10), async (req, res, next) => {
    // console.log(`from pictures`, req.files);

    try {
      const user = await User.findByPk(req.params.userId);
      const location = await Location.findByPk(req.params.locationName);

      const allImages = await Promise.all(
        req.files.map((image) => {
          return PictureAtLocation.create({
            imageUrl: image.filename,
          });
        })
      ).then((allImages) => {
        allImages.map((image) => {
          // create associations with the location and user
          user.addPictureAtLocations(image);
          location.addPictureAtLocations(image);
        });
      });

      res.send(
        await PictureAtLocation.findAll({
          where: {
            userId: req.params.userId,
            locationName: req.params.locationName,
          },
        })
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

// /api/pictures/:id

router.delete(`/:id`, async (req, res, next) => {
  try {
    const pictureToDelete = await PictureAtLocation.findByPk(req.params.id);
    await pictureToDelete.destroy();
    res.send(200);
  } catch (error) {
    next(error);
  }
});
