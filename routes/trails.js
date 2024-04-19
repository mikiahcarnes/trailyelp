const express = require("express");
const router = express.Router();
const trails = require("../controllers/trails");
const CatchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateTrail } = require("../middleware");

const Trail = require("../models/trail");

router
  .route("/")
  .get(CatchAsync(trails.index))
  .post(isLoggedIn, validateTrail, CatchAsync(trails.createTrail));

router.get("/new", isLoggedIn, trails.renderNewForm);

router
  .route("/:id")
  .get(CatchAsync(trails.showTrail))
  .put(CatchAsync(trails.updateTrail))
  .delete(isLoggedIn, CatchAsync(trails.deleteTrail));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  CatchAsync(trails.renderEditForm)
);

module.exports = router;
