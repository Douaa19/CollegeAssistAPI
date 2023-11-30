const mongoose = require("mongoose");

const content = (content) => {
  return `${content}`;
};

// Blogs schema
const Blogs = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", Blogs);

module.exports = Blog;
