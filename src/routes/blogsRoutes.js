const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Blogs, uploadImageBlog } = require("../controllers");

// create blog
router
  .route("/create")
  .post(
    authorization,
    authorizationRole("super-admin"),
    uploadImageBlog.single("blog_img"),
    Blogs.createBlog
  );

// get blog

// get all blog

// delete blog

// edit blog

module.exports = router;
