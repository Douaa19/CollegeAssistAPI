const { ApplicationDeadline, University } = require("../models");

// create
const createApplicationDeadline = async (req, res) => {
  try {
    const { university_id } = req.params;
    const data = req.body.applicationDeadlines;

    const universityExists = await University.findById(university_id);
    if (universityExists) {
      for (const deadlineData of data) {
        const [month, year, decisions] = deadlineData;

        const applicationDeadlines = new ApplicationDeadline({
          month,
          year,
          decisions,
          university_id: universityExists._id,
        });

        await applicationDeadlines.save();
      }
      res
        .status(200)
        .send({ message: "Application deadlines inserted successfully" });
    } else {
      res.status(400).send({ messageError: "University doesn't exists" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// edit
const editApplicationDeadline = async (req, res) => {
  try {
    const { application_id } = req.params;
    const applicationDeadline = await ApplicationDeadline.findById(
      application_id
    );
    const data = {
      month: req.body.month,
      year: req.body.year,
      decisions: req.body.decisions
        ? req.body.decisions.split(",")
        : applicationDeadline.decisions,
    };

    const editedApplication = await ApplicationDeadline.findByIdAndUpdate(
      application_id,
      data
    );
    if (editedApplication) {
      res.status(200).send(editedApplication);
    } else {
      res
        .status(400)
        .send({ messageError: "Application deadline doesn't edited!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get application deadlines by university_id
const getApplicationDeadlines = async (req, res) => {
  try {
    const { university_id } = req.params;
    const applicationDeadlines = await ApplicationDeadline.find({
      university_id,
    });
    if (applicationDeadlines.length > 0) {
      res.status(200).send(applicationDeadlines);
    } else {
      res
        .status(404)
        .send({ messageError: "Application deadlines not found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createApplicationDeadline,
  editApplicationDeadline,
  getApplicationDeadlines,
};
