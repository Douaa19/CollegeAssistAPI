const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Documents, uploadDocuments } = require("../controllers");

router
  .route("/add-document")
  .post(
    authorization,
    authorizationRole("manager", "student"),
    uploadDocuments.single("document"),
    Documents.addDocument
  );

router
  .route("/:course_id")
  .get(
    authorization,
    authorizationRole("manager", "student"),
    Documents.getDocuments
  );

module.exports = router;
