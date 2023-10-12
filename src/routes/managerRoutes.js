const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Manager } = require("../controllers");

// get pending studnts
router
  .route("/pending-students/")
  .get(authorization, authorizationRole("manager"), Manager.getPendingStudents);

module.exports = router;
