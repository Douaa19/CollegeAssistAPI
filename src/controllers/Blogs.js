const { Blog, User } = require("../models");
const nodemailer = require("nodemailer");

const createBlog = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      content: req.body.content,
      image: req.file.filename,
    };

    const blogExists = await Blog.findOne({ title: data.title });
    if (!blogExists) {
      const newBlog = await Blog.create(data);
      if (newBlog) {
        

        res.status(200).send(newBlog);
      } else {
        res.status(400).send({ messageError: "Blog doesn't created!" });
      }
    } else {
      res.send({ messageError: "This title is already exists!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createBlog,
};
