const { User, StudentsCourses } = require("../models");

const addCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).send({ messageError: "User not found" });
    } else {
      const newRequest = await StudentsCourses.create({
        course_id,
        student_id: user._id,
      });
      if (newRequest) {
        res.status(200).send(newRequest);
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addCourse,
};
