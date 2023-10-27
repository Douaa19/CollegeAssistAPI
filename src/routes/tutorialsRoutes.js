const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Tutorial, uploadFilesTutorials } = require("../controllers");

router
  .route("/create")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    uploadFilesTutorials.single("attachment"),
    Tutorial.createTutorial
  );

router.route("/").get(authorization, Tutorial.getTutorials);

module.exports = router;
