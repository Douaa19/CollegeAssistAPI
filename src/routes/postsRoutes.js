const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Posts, uploadImagePost } = require("../controllers");

// create blog
router
  .route("/create")
  .post(
    authorization,
    authorizationRole("super-admin"),
    uploadImagePost.single("post_img"),
    Posts.createPost
  );

// get blog
router.route("/").get(authorization, Posts.getPosts);

// get all blog
router.route("/:post_id").get(authorization, Posts.getPost);

// delete blog

// edit blog

module.exports = router;
