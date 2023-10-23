const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Course, uploadImageCourse } = require("../controllers");

router
  .route("/create-course")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    uploadImageCourse.single("image_course"),
    Course.createCourse
  );

module.exports = router;
