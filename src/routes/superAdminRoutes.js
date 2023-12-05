const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { SuperAdmin } = require("../controllers");

// change manager for student
router
  .route("/edit-manager/:student_id")
  .post(
    authorization,
    authorizationRole("super-admin"),
    SuperAdmin.editManagerForStudent
  );

module.exports = router;
