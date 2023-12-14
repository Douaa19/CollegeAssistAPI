const { University } = require("../models");

const createUniversity = async (req, res) => {
  try {
    const data = [req.body.name, req.body.description, req.body.country_id];
    const image = req.file.filename;
    const universityExists = await University.findOne({
      name: data[0],
      country_id: data[2],
    });
    if (universityExists) {
      res.status(200).send({
        message: "This university already exists!",
        university: universityExists,
      });
    } else {
      const newUniversity = await University.create({
        name: data[0],
        description: data[1],
        country_id: data[2],
        image,
      });
      if (newUniversity) {
        res.status(200).send(newUniversity);
      } else {
        res.status(500).send("University doesn't created!");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUniversity = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUniversities = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUniversity = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUniversity = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const filterUniversity = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createUniversity,
  getUniversity,
  getUniversities,
  deleteUniversity,
  updateUniversity,
  filterUniversity,
};
