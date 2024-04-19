const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Trail = require("../models/trail");
const reviews = require("../controllers/reviews");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const CatchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, validateReview, CatchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  CatchAsync(reviews.deleteReview)
);

module.exports = router;
