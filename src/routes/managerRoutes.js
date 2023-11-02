const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Manager } = require("../controllers");

// get pending studnts
router
  .route("/pending-students/")
  .get(
    authorization,
    authorizationRole("manager", "super-admin"),
    Manager.getPendingStudents
  );

// accept student
router
  .route("/accept-student/:student_id")
  .post(
    authorization,
    authorizationRole("manager", "super-admin"),
    Manager.acceptStudent
  );

// get my students
router
  .route("/my-students")
  .get(authorization, authorizationRole("manager"), Manager.getMyStudents);

// get course's requests
router
  .route("/courses-requests")
  .get(authorization, authorizationRole("manager"), Manager.getCourseRequest);

// accept course requests
router
  .route("/accept-course-request/:id")
  .post(
    authorization,
    authorizationRole("manager"),
    Manager.acceptCourseRequest
  );

module.exports = router;
