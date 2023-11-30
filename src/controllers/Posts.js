const { Post, User, Email } = require("../models");
const nodemailer = require("nodemailer");
const blogEmail = require("../emails/Blog");

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

module.exports = {
  createPost,
  getPosts,
  getPost,
};
