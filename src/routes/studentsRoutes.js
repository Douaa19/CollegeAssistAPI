const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { User, StudentCourse } = require("../controllers");

// asing new students to their managers
router.route("/assign-students").post(User.assingStudentsToManagers);

// add course
router
  .route("/add-course/:course_id")
  .post(authorization, StudentCourse.addCourse);

module.exports = router;
