const express = require("express");
const router = express.Router();

// controllers
const { User } = require("../controllers");

router.route("/register").post(User.register);

router.route("/login").post(User.login);

module.exports = router;
