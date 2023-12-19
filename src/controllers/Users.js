const { User, Email } = require("../models");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("node-uuid");
const cron = require("node-cron");
const path = require("path");
const welcomeEmail = require("../emails/Welcome");
const forgetPasswordEmail = require("../emails/ForgetPassword");
const resetPasswordEmail = require("../emails/ResetPassword");

const register = async (req, res) => {
  try {
    const user = [
      req.body.firstName, //0
      req.body.lastName, //1
      req.body.email, //2
      req.body.password, //3
      req.body.country, //4
      req.body.city, //5
      req.body.role, //6
      req.body.school, //7
      req.body.birthday, //8
      req.body.targetCountries, //9
      req.body.targetSchools, //10
      (status = ""), //11
    ];
    const image = req.file.filename;
    const targetCountries = user[9] ? user[9].split(",") : null;
    const targetSchools = user[10] ? user[10].split(",") : null;

    // check email
    const emailExists = await User.exists({ email: user[2] });

    if (emailExists) {
      res.send({ emailExist: "This email is already used" });
    } else {
      if (user[6] === "student") {
        user[11] = "pending";
      } else {
        user[11] = null;
      }

      const dateStr = new Date();
      const lastAccess = moment.utc(dateStr).format("DD/MM/YYYY HH:mm");

      const newUser = await User.create({
        firstName: user[0],
        lastName: user[1],
        email: user[2],
        password: user[3],
        country: user[4],
        city: user[5],
        role: user[6],
        school: user[7],
        birthday: user[8],
        profile_img: image,
        targetCountries: targetCountries,
        targetSchools: targetSchools,
        lastAccess,
        status: user[11],
        manager_id: null,
      });

      // send welcome email
      const id = newUser._id;
      const firstName = newUser.firstName;
      const lastName = newUser.lastName;
      const email = newUser.email;
      const role = newUser.role;
      const token = jwt.sign(
        { id, firstName, lastName, email, role },
        process.env.JWT_ACCESS_SECRET
      );

      if (token) {
        if (newUser.role === "student") {
          const email = await Email.findOne({ title: "welcome" });
          if (email) {
            const transporter = nodemailer.createTransport({
              host: "mail.smartpeddle.com",
              port: 587,
              tls: {
                rejectUnauthorized: false,
              },
              auth: {
                user: "collegeassist@smartpeddle.com",
                pass: "CollegeAssist23159.",
              },
            });
            const mailOprtions = {
              from: '"College Assist" <collegeassist@smartpeddle.com>',
              to: newUser.email,
              subject: email.subject,
              html: welcomeEmail.welcomeEmail(email.content, newUser),
            };
            mailOprtions.headers = {
              "Content-Type": "text/html",
            };
            transporter.sendMail(mailOprtions, (error, info) => {
              if (error) {
                res.send(error);
              } else {
                res.json({ token });
              }
            });
          } else {
            console.log("Email content not found");
          }
        } else {
          res.status(200).send(token);
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      messageError: "Somthing goes wrong in back",
      err: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    let data = "";
    let { email = req.body.email, password = req.body.password } = data;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send({ messageError: "Credentials are invalid" });
    } else {
      await user.comparePasswords(password).then(async (result) => {
        if (result) {
          const id = user._id;
          const firstName = user.firstName;
          const lastName = user.lastName;
          const email = user.email;
          const role = user.role;
          const token = jwt.sign(
            { id, firstName, lastName, email, role },
            process.env.JWT_ACCESS_SECRET
          );

          if (token) {
            const dateStr = new Date();
            const lastAccess = moment.utc(dateStr).format("DD.MM.YYYY HH:mm");
            await User.findByIdAndUpdate(user._id, { lastAccess });
            return res.status(200).send({ token });
          } else {
            res.status(500).send({ messageError: "Token doesn't created" });
          }
        } else {
          return res.status(500).send({ messageError: "Password is wrong!" });
        }
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Somthing goes wrong in server", error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send({ messageError: "User not found" });
    } else {
      const token = uuid.v4();

      user.resetToken = token;
      await user.save();

      const resetLink = `http://localhost:8080/recreate-password/${user.resetToken}`;

      const email = await Email.findOne({ title: "forget password" });
      if (email) {
        const transporter = nodemailer.createTransport({
          host: "mail.smartpeddle.com",
          port: 587,
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: "collegeassist@smartpeddle.com",
            pass: "CollegeAssist23159.",
          },
        });
        const mailOprtions = {
          from: '"College Assist" <collegeassist@smartpeddle.com>',
          to: user.email,
          subject: email.subject,
          html: forgetPasswordEmail.forgetPassword(email.content, resetLink),
        };
        mailOprtions.headers = {
          "Content-Type": "text/html",
        };
        transporter.sendMail(mailOprtions, (error, info) => {
          if (error) {
            res.send(error);
          } else {
            res.status(200).send({
              messageSuccess: "Check your box mail",
              resetLink,
              id: user._id,
            });
          }
        });
      } else {
        console.log("Email content not found");
      }
    }
  } catch (error) {
    res.status(500).send({ messageError: "Somthing goes wrong in server" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { reset_token } = req.body;
    const { user_id } = req.params;
    if (req.body.new_password === req.body.confirm_password) {
      const user = await User.findOne({
        _id: user_id,
        resetToken: reset_token,
      });
      if (user) {
        user.password = req.body.new_password;
        user.resetToken = null;
        await user.save();

        // send email
        const email = await Email.findOne({ title: "reset password" });
        const link = "https://www.google.ma";
        if (email) {
          const transporter = nodemailer.createTransport({
            host: "mail.smartpeddle.com",
            port: 587,
            tls: {
              rejectUnauthorized: false,
            },
            auth: {
              user: "collegeassist@smartpeddle.com",
              pass: "CollegeAssist23159.",
            },
          });
          const mailOprtions = {
            from: '"College Assist" <collegeassist@smartpeddle.com>',
            to: user.email,
            subject: email.subject,
            html: resetPasswordEmail.resetPassword(email.content, link),
          };
          mailOprtions.headers = {
            "Content-Type": "text/html",
          };
          transporter.sendMail(mailOprtions, (error, info) => {
            if (error) {
              res.send(error);
            } else {
              let messageSuccess = "Your password updated.";
              const id = user._id;
              const firstName = user.firstName;
              const lastName = user.lastName;
              const email = user.email;
              const role = user.role;
              const token = jwt.sign(
                { id, firstName, lastName, email, role },
                process.env.JWT_ACCESS_SECRET
              );
              if (token) {
                res.status(200).json({ messageSuccess, token });
              }
            }
          });
        } else {
          console.log("Email content not found");
        }
      } else {
        res.status(400).send({ messageError: "User not found" });
      }
    } else {
      res.json({ messageError: "Your passwords are not the same" });
    }
  } catch (error) {
    res.status(500).send({
      messageError: "Somthing goes wrong in server",
      error: error.message,
    });
  }
};

// assign each new student to his manager
const assingStudentsToManagers = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    //
    yesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    // Fetch new students
    const students = await User.find({
      role: "student",
      status: "pending",
      createdAt: { $gte: yesterday, $lt: endOfYesterday },
      manager_id: null,
    });

    // Fetch managers
    const managers = await User.find({ role: "manager" });

    // Distribute students to managers
    let studentIndex = 0;
    for (let managerIndex = 0; studentIndex < students.length; managerIndex++) {
      const manager = managers[managerIndex % managers.length];
      students[studentIndex].manager_id = manager._id;
      await students[studentIndex].save();
      studentIndex++;
    }

    console.log(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ messageError: "User not found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get user's image
const getImage = async (req, res) => {
  try {
    await User.findOne({ profile_img: req.params.profile_image })
      .exec()
      .then((result) => {
        res
          .status(200)
          .sendFile(
            path.join(
              path.dirname(__dirname),
              "public",
              "images",
              "profile",
              result.profile_img
            )
          );
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
  assingStudentsToManagers,
  getProfile,
  getImage,
};
