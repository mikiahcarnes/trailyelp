const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Trail = require("../models/trail");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const CatchAsync = require("../utils/catchAsync");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    req.flash("success", "Created new review!");
    res.redirect(`/trails/${trail._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/trails/${id}`);
  })
);

module.exports = router;
