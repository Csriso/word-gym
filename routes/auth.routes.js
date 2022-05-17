const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const uploader = require("../middleware/uploader.js");
const { nodemailer, transporter } = require("../utils/nodemailer");
const User = require("../models/User.model");

// @desc    Profile User
// @route   GET /auth/profile
// @access  Private
router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log(req.session.user);
  res.render("profile.hbs", { user: req.session.user });
});

router.post(
  "/profile",
  isLoggedIn,
  uploader.single("avatar"),
  async (req, res, next) => {
    const { username, name, lastName } = req.body;
    const id = req.session.user._id;
    console.log("intentando subir imagen", req.file);
    try {
      if (!req.file) {
        await UserModel.findByIdAndUpdate(id, {
          username: username,
          name: name,
          lastName: lastName,
        });
      } else {
        await UserModel.findByIdAndUpdate(id, {
          username: username,
          name: name,
          lastName: lastName,
          avatar: req.file.path,
        });
      }
      const saveUser = await UserModel.findById(id).then((res) => {
        req.app.locals.activeUser = res;
        req.session.user = res;
        console.log(res);
      });

      res.redirect("/auth/profile");
    } catch (err) {
      console.log(err);
    }
  }
);
// @desc    Signup User
// @route   GET /auth/signup
// @access  Public
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs", { noHeader: true });
});

// @desc    Signup User
// @route   POST /auth/signup
// @access  Public
router.post("/signup", async (req, res, next) => {
  const { email, password, repeatPassword } = req.body;

  if (!email || !password) {
    res.render("auth/signup.hbs", {
      errorMessage: "Fill out all the inputs",
      email: email,
      noHeader: true,
    });
    return;
  }
  if (password.length < 8) {
    res.render("auth/signup.hbs", {
      errorMessage: "Password has to be at least 8 characters long",
      email: email,
      noHeader: true,
    });
    return;
  }

  if (password !== repeatPassword) {
    res.render("auth/signup.hbs", {
      errorMessage: "Passwords dosent match.",
      email: email,
      noHeader: true,
    });
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup", {
      errorMessage:
        "contraseña no valida, necesita 8 char, una letra y un numero",
      email: email,
      noHeader: true,
    });
    return;
  }

  try {
    const foundUser = await UserModel.findOne({ email: email });
    if (foundUser) {
      res.render("auth/signup.hbs", {
        errorMessage: "Email already in use",
        noHeader: true,
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const createUser = await UserModel.create({
      email,
      password: hashPassword,
    });

    let activationLink = "http://localhost:3000/auth/";
    activationLink += createUser._id + "/activateAccount";
    let htmlToSend = `
    <div style="background-color: rgb(31 41 55); width: 100%; height: 100%">
      <div style="display:flex;flex-direction:column;justify-content:center; justify-items:center; align-items:center; align-content:center;">
        <h4 style="color:white;">Hello, welcome to Word Gym!</h4>
        <p style="color:white;">Please activate your account on the link below</p>
        <a style="color:white; width:200px; height:80px; border-radius:25px;" href="${activationLink}">LINK</a>
      </div>
    </div>`;
    mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Welcome to WordGym! Activate your account.",
      html: `${htmlToSend}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

// @desc    Login User
// @route   GET /auth/login
// @access  Public
router.get("/login", (req, res, next) => {
  if (req.query.account) {
    const { account } = req.query;
    res.render("auth/login.hbs", {
      noHeader: true,
      account: account,
    });
  } else if (req.query.checkYourEmail) {
    const { checkYourEmail } = req.query;
    res.render("auth/login.hbs", {
      noHeader: true,
      checkYourEmail: checkYourEmail,
    });
  } else {
    res.render("auth/login.hbs", { noHeader: true });
  }
});

// @desc    Login User
// @route   POST /auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login.hbs", {
      errorMessage: "Introduce los datos de login",
      noHeader: true,
    });
    return;
  }

  try {
    const findUser = await UserModel.findOne({ email: email });
    if (!findUser) {
      res.render("auth/login.hbs", {
        errorMessage: "No existe el usuario introducido",
        noHeader: true,
      });
      return;
    }

    if (findUser.active === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Necesitas activar la cuenta de usuario",
        accountResend: findUser._id,
        noHeader: true,
      });
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      res.render("auth/login.hbs", {
        errorMessage: "La contraseña no es correcta.",
        noHeader: true,
      });
      return;
    }

    req.session.user = findUser;
    req.app.locals.userIsActive = true;
    req.app.locals.activeUser = findUser;
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/:id/activateAccount", async (req, res, next) => {
  const { id } = req.params;
  try {
    let findUser = await UserModel.findByIdAndUpdate(id, { active: true });
    res.redirect("/auth/login?account=activated");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/resendEmail", async (req, res, next) => {
  const { id } = req.params;
  try {
    const findEmail = await UserModel.findById(id);
    let activationLink = "http://localhost:3000/auth/";
    activationLink += id + "/activateAccount";
    let htmlToSend = `
    <div style="background-color: rgb(31 41 55); width: 100%; height: 100%">
      <div style="display:flex;flex-direction:column;justify-content:center; justify-items:center; align-items:center; align-content:center;">
        <h4 style="color:white;">Hello, welcome to Word Gym!</h4>
        <p style="color:white;">Please activate your account on the link below</p>
        <a style="color:white; border-radius:25px;" href="${activationLink}">LINK</a>
      </div>
    </div>`;
    console.log(findEmail);
    mailOptions = {
      from: "youremail@gmail.com",
      to: findEmail.email,
      subject: "Welcome to WordGym! Activate your account.",
      html: `${htmlToSend}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.redirect("/auth/login?checkYourEmail=true");
  } catch (err) {
    next(err);
  }
});

router.get("/forgetPassword", (req, res, next) => {
  res.render("auth/forgetPassword.hbs", { noHeader: true });
});

router.post("/forgetPassword", async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  try {
    const findEmail = await UserModel.findById(id);
    console.log(findEmail);
    if (findEmail) {
      let activationLink = "http://localhost:3000/auth/";
      activationLink += findEmail.id + "/resetPassword";
      let htmlToSend = `
    <div style="background-color: rgb(31 41 55); width: 100%; height: 100%">
      <div style="display:flex;flex-direction:column;justify-content:center; justify-items:center; align-items:center; align-content:center;">
        <h4 style="color:white;">Reset your password!</h4>
        <p style="color:white;">Please reset your password on the link below</p>
        <a style="color:white; border-radius:25px;" href="${activationLink}">LINK</a>
      </div>
    </div>`;
      mailOptions = {
        from: "youremail@gmail.com",
        to: findEmail.email,
        subject:
          "Welcome back to WordGym! retrieve your password in the next link.",
        html: `${htmlToSend}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    res.redirect("/auth/login?checkYourEmail=true");
  } catch (err) {
    next(err);
  }
});

router.get("/:id/resetPassword", async (req, res, next) => {});

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  req.app.locals.userIsActive = false;
  req.app.locals.activeUser = undefined;

  res.redirect("/auth/login");
});

module.exports = router;
