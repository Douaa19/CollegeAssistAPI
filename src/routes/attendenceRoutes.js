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

module.exports = router;
