const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { ApplicationDeadlines } = require("../controllers");

// create
router
  .route("/create/:university_id")
  .post(
    authorization,
    authorizationRole("manager"),
    ApplicationDeadlines.createApplicationDeadline
  );

module.exports = router;
