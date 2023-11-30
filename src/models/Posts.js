const mongoose = require("mongoose");

const content = (content) => {
  return `${content}`;
};

// Posts schema
const Posts = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", Posts);

module.exports = Post;
