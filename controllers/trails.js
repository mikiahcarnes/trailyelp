const Trail = require("../models/trail");

module.exports.index = async (req, res) => {
  const trails = await Trail.find({});
  res.render("trails/index", { trails });
};

module.exports.renderNewForm = (req, res) => {
  res.render("trails/new");
};

module.exports.createTrail = async (req, res, next) => {
  const trail = new Trail(req.body.trail);
  trail.author = req.user._id;
  await trail.save();
  req.flash("success", "Successfully made a new trail!");
  res.redirect(`/trails/${trail._id}`);
};

module.exports.showTrail = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const trail = await Trail.findById(id);
  if (!trail) {
    req.flash("error", "Cannot find that trail!");
    return res.redirect("/trails");
  }
  res.render("trails/edit", { trail });
};

module.exports.updateTrail = async (req, res) => {
  const { id } = req.params;
  const trail = await Trail.findByIdAndUpdate(id, {
    ...req.body.trail,
  });
  req.flash("success", "Successfully updated trail!");
  res.redirect(`/trails/${trail._id}`);
};

module.exports.deleteTrail = async (req, res) => {
  const { id } = req.params;
  await Trail.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted trail!");
  res.redirect("/trails");
};
