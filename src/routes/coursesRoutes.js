const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Course } = require("../controllers");

router
  .route("/create-course")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    Course.createCourse
  );

module.exports = router;
