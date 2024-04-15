const express = require("express");
const router = express.Router({ mergeParams: true });

const Trail = require("../models/trail");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas.js");

const CatchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    req.flash("success", "Created new review!");
    res.redirect(`/trails/${trail._id}`);
  })
);

router.delete(
  "/:reviewId",
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/trails/${id}`);
  })
);

module.exports = router;
