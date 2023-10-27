const { Tutorial } = require("../models");

const createTutorial = async (req, res) => {
  try {
    const data = [req.body.title, req.body.course_id];
    const attachment = req.file.filename;

    const tutoExists = await Tutorial.find({
      course_id: data[1],
      title: data[0],
    });
    if (tutoExists.length > 0) {
      res
        .status(200)
        .send({ messageError: "This tutorial is already exists", tutoExists });
    } else {
      const newTuto = await Tutorial.create({
        title: data[0],
        course_id: data[1],
        attachment,
      });
      if (!newTuto) {
        res.status(400).send({ messageError: "Tutorial not created" });
      } else {
        res.status(200).send(newTuto);
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createTutorial,
};
