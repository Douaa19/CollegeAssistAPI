const { Document, Course, StudentsCourses, User } = require("../models");

const addDocument = async (req, res) => {
  try {
    const data = {
      status: "pending",
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
    console.log(newDocument, name);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addDocument,
};
