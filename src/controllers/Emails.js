const { Email } = require("../models");

const createEmail = async (req, res) => {
  try {
    const newEmail = [req.body.title, req.body.subject, req.body.content];

    const emailExists = await Email.findOne({ title: newEmail[0] });
    if (!emailExists) {
      const email = await Email.create({
        title: newEmail[0],
        subject: newEmail[1],
        content: newEmail[2],
      });
      if (email) {
        res.status(200).send({ messageSuccess: "email created", email });
      }
    } else {
      res
        .status(200)
        .send({ mesaage: "This email is alredy exists", emailExists });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getEmail = async (req, res) => {
  try {
    const { email_title } = req.params;
    const email = await Email.findOne({ title: email_title });
    if (email) {
      res.status(200).send(email);
    } else {
      res.status(404).send({ messageError: "Email not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editEmail = async (req, res) => {
  try {
    const { email_id } = req.params;
    const data = {
      subject: req.body.subject,
      content: req.body.content,
    };
    const email = await Email.findByIdAndUpdate(email_id, data);
    if (email) {
      res.status(200).send(email);
    } else {
      res.status(400).send({ messageError: "Email not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createEmail,
  getEmail,
  editEmail,
};
