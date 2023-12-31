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

// edit
router
  .route("/edit/:application_id")
  .post(
    authorization,
    authorizationRole("manager"),
    ApplicationDeadlines.editApplicationDeadline
  );

// get application deadlines by university_id
router
  .route("/:university_id")
  .get(
    authorization,
    authorizationRole("manager"),
    ApplicationDeadlines.getApplicationDeadlines
  );

module.exports = router;
