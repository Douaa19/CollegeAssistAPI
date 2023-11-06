const { Document, Course, StudentsCourses, User } = require("../models");
const fs = require("fs");

const addDocument = async (req, res) => {
  try {
    const data = {
      status: "missing",
      course_id: req.body.course_id,
    };
    const name = req.file.filename;
    const newDocument = await Document.create({
      name,
      status: data.status,
      course_id: data.course_id,
    });
    if (newDocument) {
      res.status(200).send(newDocument);
    } else {
      res.status(400).send({ messageError: "New document doesn't insert" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getDocuments = async (req, res) => {
  try {
    const { course_id } = req.params;
    const documents = await Document.find({ course_id });
    if (documents.length > 0) {
      res.status(200).send(documents);
    } else {
      res
        .status(400)
        .send({ messageError: "This course doesn't have any documents" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getFile = async (req, res) => {
  try {
    await Document.findOne({ name: req.params.filename })
      .exec()
      .then((result) => {
        res
          .status(200)
          .sendFile(
            path.join(
              path.dirname(__dirname),
              "public",
              "courses",
              "documents",
              result.name
            )
          );
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editDocument = async (req, res) => {
  try {
    const path = "src\\public\\courses\\documents\\";
    const { document_id } = req.params;
    const document = await Document.findById(document_id);
    if (document) {
      if (req.file.filename) {
        fs.unlink(`${path}${document.name}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File delted successfully");
          }
        });
      }

      const name = req.file.filename;

      await Document.findByIdAndUpdate(document_id, {
        name: name,
      }).then((result) => {
        if (result) {
          res.status(200).send({
            messageSuccess: "Document updated successfully!",
            result,
          });
        } else {
          res.status(400).send({ messageError: "Document doesn't updated!" });
        }
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteDocument = async (req, res) => {
  try {
    const path = "src\\public\\courses\\documents\\";
    const { document_id } = req.params;
    const document = await Document.findByIdAndDelete(document_id);
    if (document) {
      fs.unlink(`${path}${document.name}`, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({
            messageSuccess: "Document deletes successfully",
            document,
          });
        }
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editDocumentStatus = async (req, res) => {
  try {
    const { document_id } = req.params;
    const document = await Document.findById(document_id);
    if (document) {
      document.status = req.body.status;
      document.save();

      res.status(200).send({
        messageSuccess: "Document's status updated successfully!",
        document,
      });
    } else {
      res
        .status(400)
        .send({ messageError: "Document status doesn't updated!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addDocument,
  getDocuments,
  getFile,
  editDocument,
  deleteDocument,
  editDocumentStatus,
};
