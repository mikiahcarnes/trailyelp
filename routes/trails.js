const express = require("express");
const router = express.Router();
const trails = require("../controllers/trails");
const CatchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateTrail } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Trail = require("../models/trail");

router
  .route("/")
  .get(CatchAsync(trails.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateTrail,
    CatchAsync(trails.createTrail)
  );

router.get("/new", isLoggedIn, trails.renderNewForm);

router
  .route("/:id")
  .get(CatchAsync(trails.showTrail))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateTrail,
    CatchAsync(trails.updateTrail)
  )
  .delete(isLoggedIn, isAuthor, CatchAsync(trails.deleteTrail));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  CatchAsync(trails.renderEditForm)
);

module.exports = router;
