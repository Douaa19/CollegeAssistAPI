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

router
  .route("/file/:filename")
  .get(
    authorization,
    authorizationRole("manager", "student"),
    Documents.getFile
  );

router
  .route("/edit-document/:document_id")
  .post(
    authorization,
    authorizationRole("manager", "student"),
    uploadDocuments.single("document"),
    Documents.editDocument
  );

router
  .route("/delete-document/:document_id")
  .post(
    authorization,
    authorizationRole("manager", "student"),
    Documents.deleteDocument
  );

router
  .route("/edit-document-status/:document_id")
  .post(
    authorization,
    authorizationRole("manager"),
    uploadDocuments.single("document"),
    Documents.editDocumentStatus
  );

router
  .route("/documents/:student_id")
  .get(
    authorization,
    authorizationRole("manager"),
    Documents.getDocumentsByStudent
  );

module.exports = router;
