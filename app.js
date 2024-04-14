const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const ejsMate = require("ejs-mate");
const { trailSchema, reviewSchema } = require("./schemas.js");
const CatchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Trail = require("./models/trail");
const Review = require("./models/review");

mongoose.connect("mongodb://localhost:27017/trail-camp");

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateTrail = (req, res, next) => {
  const { error } = trailSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/trails",
  CatchAsync(async (req, res) => {
    const trails = await Trail.find({});
    res.render("trails/index", { trails });
  })
);

app.get("/trails/new", (req, res) => {
  res.render("trails/new");
});

app.post(
  "/trails",
  CatchAsync(async (req, res) => {
    const trail = new Trail(req.body.trail);
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
  })
);

app.get(
  "/trails/:id",
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate("reviews");
    res.render("trails/show", { trail });
  })
);
app.get(
  "/trails/:id/edit",
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    res.render("trails/edit", { trail });
  })
);

app.put(
  "/trails/:id",
  validateTrail,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body.trail });
    res.redirect(`/trails/${trail._id}`);
  })
);

app.delete(
  "/trails/:id",
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    res.redirect("/trails");
  })
);

app.post(
  "/trails/:id/reviews",
  validateReview,
  CatchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
  })
);

app.delete(
  "/trails/:id/reviews/:reviewId",
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/trails/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!!";
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
