const express = require("express");
const router = express.Router();

// controllers
const { User, uploadImage } = require("../controllers");

router
  .route("/register")
  .post(uploadImage.single("profile_img"), User.register);

router.route("/login").post(User.login);

module.exports = router;
