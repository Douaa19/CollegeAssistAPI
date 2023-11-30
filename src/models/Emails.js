const mongoose = require("mongoose");

const content = (content) => {
  return `${content}`;
};

// Emails schema
const Emails = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
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

const Email = mongoose.model("Email", Emails);

module.exports = Email;
