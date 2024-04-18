const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateTrail } = require("../middleware");

const Trail = require("../models/trail");

router.get(
  "/",
  CatchAsync(async (req, res) => {
    const trails = await Trail.find({});
    res.render("trails/index", { trails });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("trails/new");
});

router.post(
  "/",
  isLoggedIn,
  CatchAsync(async (req, res) => {
    const trail = new Trail(req.body.trail);
    trail.author = req.user._id;
    await trail.save();
    req.flash("success", "Successfully made a new trail!");
    res.redirect(`/trails/${trail._id}`);
  })
);

router.get(
  "/:id",
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!trail) {
      req.flash("error", "Cannot find that trail!");
      return res.redirect("/trails");
    }
    res.render("trails/show", { trail });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail) {
      req.flash("error", "Cannot find that trail!");
      return res.redirect("/trails");
    }
    res.render("trails/edit", { trail });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateTrail,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    req.flash("success", "Successfully updated trail!");
    res.redirect(`/trails/${trail._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted trail");
    res.redirect("/trails");
  })
);

module.exports = router;
