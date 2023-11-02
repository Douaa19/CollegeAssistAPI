const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Attendence } = require("../controllers");

// create attendence
router
  .route("/add-attendence")
  .post(authorization, authorizationRole("manager"), Attendence.addAttendece);

// get scores
router
  .route("/scors/:course_id")
  .get(
    authorization,
    authorizationRole("manager"),
    Attendence.getStudentsScore
  );

module.exports = router;
