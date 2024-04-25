const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const { storeReturnTo } = require("../middleware");
const passport = require("passport");

router
  .route("/register")
  .get(users.renderRegister)
  .post(CatchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
