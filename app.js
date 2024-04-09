const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Trail = require("./models/trail");

mongoose.connect("mongodb://localhost:27017/trail-camp");

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/trails", async (req, res) => {
  const trails = await Trail.find({});
  res.render("trials/index");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
