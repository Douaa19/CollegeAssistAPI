const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Posts, uploadImagePost } = require("../controllers");

// create post
router
  .route("/create")
  .post(
    authorization,
    authorizationRole("super-admin"),
    uploadImagePost.single("post_img"),
    Posts.createPost
  );

// get post
router.route("/").get(authorization, Posts.getPosts);

// get all post
router.route("/:post_id").get(authorization, Posts.getPost);

// delete post
router
  .route("/delete/:post_id")
  .post(
    authorization,
    authorizationRole("super-admin"),
    uploadImagePost.single("post_img"),
    Posts.deletePost
  );

// edit post

module.exports = router;
