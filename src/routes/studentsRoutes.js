const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { User } = require("../controllers");

// asing new students to their managers
router.route("/assign-students").post(User.assingStudentsToManagers);

module.exports = router;
