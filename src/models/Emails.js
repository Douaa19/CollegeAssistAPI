const mongoose = require("mongoose");

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
    variables: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", Emails);

module.exports = Email;
