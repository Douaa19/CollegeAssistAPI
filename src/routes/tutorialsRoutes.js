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

router.route("/:tutorial_id").get(authorization, Tutorial.getTutorial);

router.route("/attachment/:attachment").get(Tutorial.getAttachment);

router.route("/tutorials-course/:course_id").get(Tutorial.getTutorialsByCourse);

router
  .route("/delete/:tutorial_id")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    Tutorial.deleteTutorial
  );

router
  .route("/edit/:tutorial_id")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    uploadFilesTutorials.single("attachment"),
    Tutorial.editTutorial
  );

module.exports = router;
