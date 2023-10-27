const { Tutorial } = require("../models");
const path = require("path");
const fs = require("fs");

// create new tuto
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

// get all tutos
const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find();
    if (tutorials.length > 0) {
      res.status(200).send(tutorials);
    } else {
      res.status(404).send({ messageError: "Tutorials not found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get one tutorial
const getTutorial = async (req, res) => {
  try {
    const { tutorial_id } = req.params;
    const tutorial = await Tutorial.findById(tutorial_id);
    if (tutorial) {
      res.status(200).send(tutorial);
    } else {
      res.status(404).send({ messageError: "Tutorial not found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get attachment
const getAttachment = async (req, res) => {
  try {
    await Tutorial.findOne({ attachment: req.params.attachment })
      .exec()
      .then((result) => {
        res
          .status(200)
          .sendFile(
            path.join(
              path.dirname(__dirname),
              "public",
              "tutorials",
              result.attachment
            )
          );
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get tutorials by course_id
const getTutorialsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const tutorials = await Tutorial.find({ course_id });
    if (tutorials.length > 0) {
      res.status(200).send(tutorials);
    } else {
      res.status(404).send({ messageError: "Tutorials not found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete tutorial
const deleteTutorial = async (req, res) => {
  try {
    const { tutorial_id } = req.params;
    const tutorial = await Tutorial.findById(tutorial_id);
    fs.unlink(
      path.join(
        path.dirname(__dirname),
        "public",
        "tutorials",
        tutorial.attachment
      ),
      async (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File deleted successfully");
        const deleteTuto = await Tutorial.findByIdAndDelete(tutorial_id);
        if (!deleteTuto) {
          res.status(500).send({ messageError: "Tutorial doesn't deleted" });
        } else {
          res.status(200).send({ messageSuccess: "Tutorial deleted" });
        }
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// edit tutorial
const editTutorial = async (req, res) => {
  try {
    const path = "src\\public\\tutorials\\";
    const { tutorial_id } = req.params;
    const tutorial = await Tutorial.findById(tutorial_id);

    if (tutorial) {
      if (req.file.filename) {
        fs.unlink(`${path}${tutorial.attachment}`, (err) => {
          if (!err) {
            console.log("File deleted successfuly!");
          } else {
            console.log(err, "File not found");
          }
        });
      }

      const newTutorial = {
        title: req.body.title,
        course_id: req.body.course_id,
        attachment: req.file.filename,
      };

      const tutorialExists = await Tutorial.find({
        title: newTutorial[0],
      });

      if (tutorialExists.length > 0) {
        res
          .status(200)
          .send({ messageError: "This title is already exists", tutoExists });
      } else {
        await Tutorial.findByIdAndUpdate(tutorial_id, newTutorial).then(
          (result) => {
            if (result) {
              res.status(200).send({
                messageSuccess: "Tutorial updated successfully!",
                result,
              });
            } else {
              res
                .status(400)
                .send({ messageSuccess: "Tutorial doesn't updated!" });
            }
          }
        );
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createTutorial,
  getTutorials,
  getTutorial,
  getAttachment,
  getTutorialsByCourse,
  deleteTutorial,
  editTutorial,
};
