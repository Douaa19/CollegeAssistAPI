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

// get course
router.route("/get-course/:course_id").get(Course.getCourse);

// get courses
router.route("/").get(Course.getCourses);

// delete course
router
  .route("/delete-course/:course_id")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    Course.deleteCourse
  );

module.exports = router;
