const express = require("express");
const router = express.Router();

// controllers
const { User, uploadImage } = require("../controllers");

// register
router
  .route("/register")
  .post(uploadImage.single("profile_img"), User.register);

// login
router.route("/login").post(User.login);

// forget password
router.route("/forget-password").post(User.forgetPassword);

// reset password
router.route("/reset_password/:user_id").post(User.resetPassword);

module.exports = router;
