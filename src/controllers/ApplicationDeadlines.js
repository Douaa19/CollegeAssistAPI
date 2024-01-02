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

module.exports = {
  createApplicationDeadline,
};
