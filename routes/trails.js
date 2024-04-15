const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const { trailSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const Trail = require("../models/trail");

const validateTrail = (req, res, next) => {
  const { error } = trailSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  CatchAsync(async (req, res) => {
    const trails = await Trail.find({});
    res.render("trails/index", { trails });
  })
);

router.get("/new", (req, res) => {
  res.render("trails/new");
});

router.post(
  "/",
  CatchAsync(async (req, res) => {
    const trail = new Trail(req.body.trail);
    await trail.save();
    req.flash("success", "Successfully made a new trail!");
    res.redirect(`/trails/${trail._id}`);
  })
);

router.get(
  "/:id",
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate("reviews");
    if (!trail) {
      req.flash("error", "Cannot find that trail!");
      return res.redirect("/trails");
    }
    res.render("trails/show", { trail });
  })
);

router.get(
  "/:id/edit",
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
      req.flash("error", "Cannot find that trail!");
      return res.redirect("/trails");
    }
    res.render("trails/edit", { trail });
  })
);

router.put(
  "/:id",
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
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted trail");
    res.redirect("/trails");
  })
);

module.exports = router;
