const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Course, uploadImageCourse, StudentCourse } = require("../controllers");

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

// get course's image
router.route("/image/:cours_id").get(Course.getImage);

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

// edit course
router
  .route("/edit-course/:course_id")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    uploadImageCourse.single("image_course"),
    Course.editCourse
  );

// get students of one course
router
  .route("/course-students/:course_id")
  .get(
    authorization,
    authorizationRole("manager", "super-admin"),
    StudentCourse.getStudentsOfCourse
  );

module.exports = router;
