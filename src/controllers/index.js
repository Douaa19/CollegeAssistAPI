const User = require("./Users");
const Manager = require("./Mnagers");
const Course = require("./Courses");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

// storage
const storage = (pathName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathName);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.toLocaleLowerCase());
    },
  });
};

// filter
const fFilter = (req, file, cb) => {
  // allowed ext
  const filetypes = /jpeg|jpg|png|svg/;

  // check ext
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );

  // check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Image only");
  }
};

const uploadImage = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "images", "profile")
  ),
});

const uploadImageCourse = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "images", "courses")
  ),
});

module.exports = {
  uploadImage,
  uploadImageCourse,
  User,
  Manager,
  Course,
};
