const { Post, User, Email } = require("../models");
const nodemailer = require("nodemailer");
const blogEmail = require("../emails/Blog");
const fs = require("fs");
const path = require("path");

const createPost = async (req, res) => {
  try {
    const post = {
      title: req.body.title,
      content: req.body.content,
      image: req.file.filename,
    };

    const postExists = await Post.findOne({ title: post.title });
    if (!postExists) {
      const newPost = await Post.create(post);
      if (newPost) {
        const email = await Email.findOne({ title: "new post" });
        const students = await User.find({ role: "student" });
        if (email && students.length > 0) {
          const transporter = nodemailer.createTransport({
            host: "mail.smartpeddle.com",
            port: 587,
            tls: {
              rejectUnauthorized: false,
            },
            auth: {
              user: "collegeassist@smartpeddle.com",
              pass: "CollegeAssist23159.",
            },
          });

          // send emails
          for (const student of students) {
            const mailOprtions = {
              from: '"College Assist" <collegeassist@smartpeddle.com>',
              to: student.email,
              subject: email.subject,
              html: blogEmail.blog(email.content, post),
            };
            mailOprtions.headers = {
              "Content-Type": "text/html",
            };
            try {
              await transporter.sendMail(mailOprtions);
              console.log(`New blog post email sent to ${student.email}`);
            } catch (error) {
              console.error(`Error sending email to ${student.email}:`, error);
            }
          }
        }
        res.status(200).send(newPost);
      } else {
        res.status(400).send({ messageError: "Post doesn't created!" });
      }
    } else {
      res.send({ messageError: "This title is already exists!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (posts.length > 0) {
      res.status(200).send(posts);
    } else {
      console.log("It's empty");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send({ messageError: "No post found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getImage = async (req, res) => {
  try {
    await Post.findById(req.params.post_id)
      .exec()
      .then((result) => {
        res
          .status(200)
          .sendFile(
            path.join(
              path.dirname(__dirname),
              "public",
              "images",
              "blog",
              result.image
            )
          );
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await Post.findByIdAndDelete(post_id);
    if (post) {
      fs.unlink(
        path.join(
          path.dirname(__dirname),
          "public",
          "images",
          "blog",
          post.image
        ),
        (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Image deleted");
          res.status(200).send({ messageSuccess: "Post deleted successfully" });
        }
      );
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    const path = "src\\public\\images\\blog\\";
    if (post) {
      if (req.file.filename) {
        fs.unlink(`${path}${post.image}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Image deleted");
          }
        });
      }
      const newData = {
        title: req.body.title,
        content: req.body.content,
        image: req.file.filename,
      };

      const postExists = await Post.findOne({ title: newData.title });
      if (!postExists) {
        const editPost = await Post.findByIdAndUpdate(post_id, newData);
        if (editPost) {
          res.status(200).send({ editPost, messageSuccess: "Post edited!" });
        } else {
          res.send({ messageError: "Post doesn't edited!" });
        }
      } else {
        res.send({ messageError: "This title is already exists" });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getImage,
  deletePost,
  editPost,
};
