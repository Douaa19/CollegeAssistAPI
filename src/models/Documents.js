const mongoose = require("mongoose");

// Documents schema
const Documents = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", Documents);

module.exports = Document;
