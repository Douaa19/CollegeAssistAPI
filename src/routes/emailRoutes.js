const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Email } = require("../controllers");

// create email
router
  .route("/create")
  .post(authorization, authorizationRole("super-admin"), Email.createEmail);

module.exports = router;
