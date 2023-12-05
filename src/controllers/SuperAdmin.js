const { User } = require("../models");

const editManagerForStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { manager_id } = req.body;

    // find both users
    const student = await User.findById(student_id);
    const manager = await User.findById(manager_id);

    if (student && manager) {
      student.manager_id = manager._id;
      student.save();
      res
        .status(200)
        .send({ messageSuccess: "Manager changed for student", student });
    } else {
      res.status(404).send({ messageError: "One user not found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  editManagerForStudent,
};
