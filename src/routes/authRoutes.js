const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { User, uploadImage } = require("../controllers");

// register
router
  .route("/auth/register")
  .post(uploadImage.single("profile_img"), User.register);

// login
router.route("/auth/login").post(User.login);

// forget password
router.route("/auth/forget-password").post(User.forgetPassword);

// reset password
router.route("/auth/reset_password/:user_id").post(User.resetPassword);

// get profile
router.route("/user-profile").get(authorization, User.getProfile);

module.exports = router;
