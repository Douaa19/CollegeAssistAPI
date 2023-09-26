const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Users schema
const Users = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "the password must be greater than 5 characters"],
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    profile_img: {
      type: String,
      required: false,
      default: null,
    },
    targetCountries: [
      {
        type: String,
        required: false,
      },
    ],
    targetSchools: [
      {
        type: String,
        required: false,
      },
    ],
    courses_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cours",
        required: false,
      },
    ],
    lastAccess: {
      type: String,
      required: true,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

Users.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10).then((hashedPassword) => {
    user.password = hashedPassword;
    next();
  });
});

Users.methods.comparePasswords = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", Users);

module.exports = User;
