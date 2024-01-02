const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Universities, uploadImageUniversity } = require("../controllers");

// create university
router
  .route("/create")
  .post(
    authorization,
    authorizationRole("manager"),
    uploadImageUniversity.single("image"),
    Universities.createUniversity
  );

// get universities
router.route("/").get(Universities.getUniversities);

// search universities
router.route("/search/").get(Universities.filterUniversity);

// get university
router.route("/:university_id").get(Universities.getUniversity);

// get university's image
router.route("/image/:university_id").get(Universities.getUniversityImage);

// update university
router
  .route("/edit/:university_id")
  .post(
    authorization,
    authorizationRole("manager"),
    uploadImageUniversity.single("image"),
    Universities.updateUniversity
  );

// delete university
router
  .route("/delete/:university_id")
  .post(
    authorization,
    authorizationRole("manager"),
    Universities.deleteUniversity
  );

module.exports = router;
