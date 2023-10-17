const { User } = require("../models");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
const uuid = require("node-uuid");
const cron = require("node-cron");
const { Manager } = require(".");

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
      const lastAccess = moment.utc(dateStr).format("DD.MM.YYYY HH:mm");

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
        //   const transporter = nodemailer.createTransport({
        //     host: "smtp.titan.email",
        //     secureConnection: false,
        //     port: 465,
        //     tls: {
        //       ciphers: "SSLv3",
        //     },
        //     auth: {
        //       user: "info@uud.io",
        //       pass: "Juusando13-info",
        //     },
        //   });
        //   const mailOprtions = {
        //     from: '"UUD" <info@uud.io>',
        //     to: `${newUser.email}`,
        //     subject: "Registration",
        //     html: `<!DOCTYPE html>
        //       <html>
        //       <head>
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        //         <style type="text/css">
        //           /* Add your preferred fonts here */
        //           body {
        //             margin: 0;
        //             padding: 0;
        //             font-family: 'Poppins', Arial, sans-serif;
        //             line-height: 160%;
        //             background-color: #F0F0F9;

        //           }
        //         </style>
        //       </head>

        //       <body style="margin: 0; padding: 0 16px;">
        //         <!-- Main Table -->
        //         <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        //           style="max-width: 680px; margin: 32px auto; background-color: white; border-collapse: collapse; border-radius: 24px; overflow: hidden; box-shadow: 0 1.5px 1px rgba(51, 46, 104, 0.16);">
        //           <!-- Header -->
        //           <tr>
        //             <td style="padding: 48px">
        //               <img src="https://uud.io/email-images/logo.svg" alt="Logo" style="display: block; max-width: 160px;">
        //             </td>
        //           </tr>
        //           <!-- Title -->
        //           <tr>
        //             <td style="padding: 0 40px 24px; width: 100%;">
        //               <h1 style=" font-weight: 500; line-height: 110%; margin: 0; font-size: 30px; color: #FF6A56;">Welcome to Our Newsletter!</h1>
        //             </td>
        //           </tr>
        //           <!-- First Paragraph -->
        //           <tr>
        //             <td style="padding: 0 40px 24px;">
        //             <p style="margin: 0; font-size: 17px;  color: #513C6A;">Hi</p>
        //             <p style="margin: 0; font-size: 17px;  color: #513C6A;">Someone has requested a link to change your password, and you can do this through the link below.</p>
        //             </td>
        //           </tr>
        //           <!-- Button -->
        //           <tr>
        //             <td style="padding: 0 40px 24px">
        //               <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="left"
        //               style="border-collapse: collapse;">
        //             <tr>
        //             <td style="border-radius: 40px; background-color: #FF6A56; padding: 0 12px 0 20px; width: 240px; height: 54px">
        //               <a href="#"
        //                 style="display: flex; align-items: center; text-decoration: none; color: #ffffff; font-weight: medium; font-size: 17px;">
        //                 <span style="flex-grow: 1; text-align: left;">Create new password</span>
        //                 <img src="https://uud.io/email-images/loading_ani.svg" alt="Icon" style="width: 35px; margin-right: 0px;">
        //               </a>
        //             </td>
        //           </tr>
        //         </table>
        //             </td>
        //           </tr>
        //           <!-- Second Paragraph -->
        //           <tr>
        //             <td style="padding: 0 40px 24px">
        //             <p style="margin: 0; ">
        //             This link will expire in 2 days.
        //             </p>
        //             <p style="margin: 0; ">
        //             Your password won’t change until you access the link above and create a new one.</br>
        //             If you didn’t request this, Please ignore this email.
        //             </p>
        //             <p style="margin: 0; ">
        //             All the best,</br>
        //             The UUD Team
        //             </p>
        //             </td>
        //           </tr>

        //           <tr>
        //             <td style="padding: 0 40px 54px">
        //               <p style="margin: 0; ">
        //                 All the bast,</br>
        //                 The UUD Team
        //               </p>
        //             </td>
        //           </tr>
        //           <!-- Footer -->
        //           <tr style="background-color: #F5F6FA; text-align: center;">
        //             <td style="padding: 48px 0 0 0 ; width: 100%;">
        //               <a href="#"><img src="https://uud.io/email-images/facebook.svg" alt="Facebook" style="max-width: 36px; padding: 0 4px;"></a>
        //               <a href="#"><img src="https://uud.io/email-images/twitter.svg" alt="Twitter" style="max-width: 36px; padding: 0 4px;"></a>
        //               <a href="#"><img src="https://uud.io/email-images/instagram.svg" alt="Instagram" style="max-width: 36px; padding: 0 4px;"></a>
        //               <a href="#"><img src="https://uud.io/email-images/linkedin.svg" alt="LinkedIn" style="max-width: 36px; padding: 0 4px;"></a>
        //           </td>
        //         </tr>
        //         <tr style="background-color: #F5F6FA; text-align: center;">
        //         <td style="padding: 0 0 48px 0; width: 100%;">
        //               <!-- <img src="https://uud.io/email-images/small_logo.svg" alt="Small Logo" style="display: inline-block; vertical-align: middle; max-width: 48px;"> -->
        //               <span style="vertical-align: middle; font-size: 14px; color: #513C6A;">Copyright.</span>
        //           </td>
        //       </tr>
        //         </table>
        //       </body>
        //       </html>`,
        //   };
        //   mailOprtions.headers = {
        //     "Content-Type": "text/html",
        //   };
        //   transporter.sendMail(mailOprtions, (error, info) => {
        //     if (error) {
        //       res.send(error);
        //     } else {
        res.json({ token });
        // }
        //   }
        //   );
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

      // send the link by email
      // const transporter = nodemailer.createTransport({
      //   host: "smtp.titan.email",
      //   secureConnection: false,
      //   port: 465,
      //   tls: {
      //     ciphers: "SSLv3",
      //   },
      //   auth: {
      //     user: "info@uud.io",
      //     pass: "Juusando13-info",
      //   },
      // });
      // const mailOprtions = {
      //   from: '"UUD" <info@uud.io>',
      //   to: `${user.email}`,
      //   subject: "Reset password",
      //   // text: `M :${user.username}
      //   //   lien:${link}`,
      //   html: `<!DOCTYPE html>
      //       <html>
      //       <head>
      //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      //         <style type="text/css">
      //           /* Add your preferred fonts here */
      //           body {
      //             margin: 0;
      //             padding: 0;
      //             font-family: 'Poppins', Arial, sans-serif;
      //             line-height: 160%;
      //             background-color: #F0F0F9;
      //           }
      //         </style>
      //       </head>

      //       <body style="margin: 0; padding: 0 16px;">
      //         <!-- Main Table -->
      //         <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
      //           style="max-width: 680px; margin: 32px auto; background-color: white; border-collapse: collapse; border-radius: 24px; overflow: hidden; box-shadow: 0 1.5px 1px rgba(51, 46, 104, 0.16);">

      //           <!-- Header -->
      //           <tr>
      //             <td style="padding: 48px">
      //               <img src="https://uud.io/email-images/logo.svg" alt="Logo" style="display: block; max-width: 160px;">
      //             </td>
      //           </tr>
      //           <!-- Title -->
      //           <tr>
      //             <td style="padding: 0 40px 24px; width: 100%;">
      //               <h1 style=" font-weight: 500; line-height: 110%; margin: 0; font-size: 30px; color: #FF6A56;">Reset your password</h1>
      //             </td>
      //           </tr>
      //           <!-- First Paragraph -->
      //           <tr>
      //             <td style="padding: 0 40px 24px;">
      //               <p style="margin: 0; font-size: 17px; color: #513C6A;">
      //               Someone has requested a link to change your password, and you can do this through the link below.
      //               </p>
      //             </td>
      //           </tr>

      //           <!-- Button -->
      //           <tr>
      //             <td style="padding: 0 40px 24px">
      //               <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="left"
      //               style="border-collapse: collapse;">
      //             <tr>
      //             <td style="border-radius: 40px; background-color: #FF6A56; padding: 0 12px 0 20px; width: 240px; height: 54px">
      //               <a href="${link}"
      //                 style="display: flex; align-items: center; text-decoration: none; color: #ffffff; font-weight: medium; font-size: 17px;">
      //                 <span style="flex-grow: 1; text-align: left;">${resetLink}</span>
      //                 <img src="./images/Loading_ani.svg" alt="Icon" style="width: 35px; margin-right: 0px;">
      //               </a>
      //               <a href="#"
      //                 style="display: flex; align-items: center; text-decoration: none; color: #ffffff; font-weight: medium; font-size: 17px;">
      //                 <span style="flex-grow: 1; text-align: left;">Get Started!!!</span>
      //                 <img src="./images/Loading_ani.svg" alt="Icon" style="width: 35px; margin-right: 0px;">
      //               </a>
      //             </td>
      //           </tr>
      //         </table>
      //             </td>
      //           </tr>

      //           <!-- Second Paragraph -->
      //           <tr>
      //             <td style="padding: 0 40px 24px">
      //               <p style="margin: 0; font-size: 17px; color: #513C6A;">
      //               This link will expire in <span style="font-size: 17px; color: #FF6A56;">2 days.</span></br></br>
      //                 Your password won’t change until you access the link above and create a new one.If you didn’t request this, Please ignore this email.
      //               </p>
      //             </td>
      //           </tr>

      //           <tr>
      //             <td style="padding: 0 40px 54px">
      //               <p style="margin: 0; font-size: 17px; color: #513C6A;">
      //                 All the bast,</br>
      //                 The UUD Team
      //               </p>
      //             </td>
      //           </tr>

      //           <!-- Footer -->
      //           <tr style="background-color: #F5F6FA; text-align: center;">
      //             <td style="padding: 48px 0 0 0 ; width: 100%;">
      //               <a href="#"><img src="https://uud.io/email-images/facebook.svg" alt="Facebook" style="max-width: 36px; padding: 0 4px;"></a>
      //               <a href="#"><img src="https://uud.io/email-images/twitter.svg" alt="Twitter" style="max-width: 36px; padding: 0 4px;"></a>
      //               <a href="#"><img src="https://uud.io/email-images/instagram.svg" alt="Instagram" style="max-width: 36px; padding: 0 4px;"></a>
      //               <a href="#"><img src="https://uud.io/email-images/linkedin.svg" alt="LinkedIn" style="max-width: 36px; padding: 0 4px;"></a>
      //           </td>
      //         </tr>
      //         <tr style="background-color: #F5F6FA; text-align: center;">
      //         <td style="padding: 0 0 48px 0; width: 100%;">
      //               <!-- <img src="https://uud.io/email-images/small_logo.svg" alt="Small Logo" style="display: inline-block; vertical-align: middle; max-width: 48px;"> -->
      //               <span style="vertical-align: middle; font-size: 14px; color: #513C6A;">Copyright.</span>
      //           </td>
      //       </tr>
      //         </table>
      //       </body>
      //       </html>`,
      // };
      // mailOprtions.headers = {
      //   "Content-Type": "text/html",
      // };

      //   transporter.sendMail(mailOprtions, (error, info) => {
      //     if (error) {
      //       res.json(error);
      //     } else {
      res.status(200).send({
        messageSuccess: "Check your box mail",
        resetLink,
        id: user._id,
        //   });
        // }
      });
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
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.titan.email",
        //     secureConnection: false,
        //     port: 465,
        //     tls: {
        //       ciphers: "SSLv3",
        //     },
        //     auth: {
        //       user: "info@uud.io",
        //       pass: "Juusando13-info",
        //     },
        //   });
        //   const mailOprtions = {
        //     from: '"UUD" <info@uud.io>',
        //     to: `${user.email}`,
        //     subject: "Confirmation reset password",
        //     // text: `Your password updated successfully.`,
        //     headers: {
        //       "Content-Type": "text/html",
        //     },
        //     html: `<!DOCTYPE html>
        //           <html>
        //           <head>
        //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //             <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        //             <style type="text/css">
        //               /* Add your preferred fonts here */
        //               body {
        //                 margin: 0;
        //                 padding: 0;
        //                 font-family: 'Poppins', Arial, sans-serif;
        //                 line-height: 160%;
        //                 background-color: #F0F0F9;
        //                 color: #513C6A;
        //                 font-size: 17px;
        //               }
        //             </style>
        //           </head>

        //           <body style="margin: 0; padding: 0 16px;">
        //             <!-- Main Table -->
        //             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        //               style="max-width: 680px; margin: 32px auto; background-color: white; border-collapse: collapse; border-radius: 24px; overflow: hidden; box-shadow: 0 1.5px 1px rgba(51, 46, 104, 0.16);">
        //               <!-- Header -->
        //               <tr>
        //                 <td style="padding: 48px">
        //                   <img src="./images/Logo.svg" alt="Logo" style="display: block; max-width: 160px;">
        //                 </td>
        //               </tr>
        //               <!-- Title -->
        //               <tr>
        //                 <td style="padding: 0 40px 24px; width: 100%;">
        //                   <h1 style=" font-weight: 500; line-height: 110%; margin: 0; font-size: 30px; color: #FF6A56;">Your password has updated</h1>
        //                 </td>
        //               </tr>
        //               <!-- First Paragraph -->
        //               <tr>
        //                 <td style="padding: 0 40px 24px;">
        //                   <p style="margin: 0; font-size: 17px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        //                 </td>
        //               </tr>
        //               <!-- Button -->
        //               <tr>
        //                 <td style="padding: 0 40px 24px">
        //                   <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="left"
        //                   style="border-collapse: collapse;">
        //                 <tr>
        //                 <td style="border-radius: 40px; background-color: #FF6A56; padding: 0 12px 0 20px; width: 240px; height: 54px">
        //                   <a href="#"
        //                     style="display: flex; align-items: center; text-decoration: none; color: #ffffff; font-weight: medium; font-size: 17px;">
        //                     <span style="flex-grow: 1; text-align: left;">Get Started!!!</span>
        //                     <img src="./images/Loading_ani.svg" alt="Icon" style="width: 35px; margin-right: 0px;">
        //                   </a>
        //                 </td>
        //               </tr>
        //             </table>
        //                 </td>
        //               </tr>
        //               <!-- Second Paragraph -->
        //               <tr>
        //                 <td style="padding: 0 40px 24px">
        //                   <p style="margin: 0; ">
        //                     Nunc vehicula justo eu arcu vehicula, a convallis tortor feugiat.</br>
        //                     Nunc vehicula justo eu arcu vehicula...
        //                   </p>
        //                 </td>
        //               </tr>

        //               <tr>
        //                 <td style="padding: 0 40px 54px">
        //                   <p style="margin: 0; ">
        //                     All the bast,</br>
        //                     The UUD Team
        //                   </p>
        //                 </td>
        //               </tr>
        //               <!-- Footer -->
        //               <tr style="background-color: #F5F6FA; text-align: center;">
        //                 <td style="padding: 48px 0 0 0 ; width: 100%;">
        //                   <a href="#"><img src="./images/facebook - s.svg" alt="Facebook" style="max-width: 48px; padding: 0 4px;"></a>
        //                   <a href="#"><img src="./images/Twitter - s.svg" alt="Twitter" style="max-width: 48px; padding: 0 4px;"></a>
        //                   <a href="#"><img src="./images/Instagram - s.svg" alt="Instagram" style="max-width: 48px; padding: 0 4px;"></a>
        //                   <a href="#"><img src="./images/Linkedin - s.svg" alt="LinkedIn" style="max-width: 48px; padding: 0 4px;"></a>
        //               </td>
        //             </tr>
        //             <tr style="background-color: #F5F6FA; text-align: center;">
        //             <td style="padding: 0 0 48px 0; width: 100%;">
        //                   <!-- <img src="./images/small_logo.svg" alt="Small Logo" style="display: inline-block; vertical-align: middle; max-width: 48px;"> -->
        //                   <span style="vertical-align: middle; font-size: 14px;">Copyright.</span>
        //               </td>
        //           </tr>
        //             </table>
        //           </body>
        //           </html>`,
        //   };

        // transporter
        //   .sendMail(mailOprtions)
        //   .then((infos) => {
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
        //   })
        //   .catch((error) => {
        //     res.status(500).json(error);
        //   });
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

cron.schedule("0 0 * * *", async () => {
  try {
    await assingStudentsToManagers();
  } catch (error) {
    console.error("Error executing assingStudentsToManagers", error.message);
  }
});

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
  assingStudentsToManagers,
};
