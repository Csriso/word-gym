const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");

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
    });
    return;
  }
  if (password.length < 8) {
    res.render("auth/signup.hbs", {
      errorMessage: "Password has to be at least 8 characters long",
      email: email,
    });
    return;
  }

  if (password !== repeatPassword) {
    res.render("auth/signup.hbs", {
      errorMessage: "Passwords dosent match.",
      email: email,
    });
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup", {
      errorMessage:
        "contraseña no valida, necesita 8 char, una letra y un numero",
      email: email,
    });
    return; // hasta aqui llega mi ruta
  }

  try {
    const foundUser = await UserModel.findOne({ email: email });
    if (foundUser) {
      res.render("auth/signup.hbs", {
        errorMessage: "Email already in use",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const createUser = UserModel.create({
      email,
      password: hashPassword,
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
  res.render("auth/login.hbs", { noHeader: true });
});

// @desc    Login User
// @route   POST /auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login.hbs", {
      errorMessage: "Introduce los datos de login",
    });
    return;
  }

  try {
    const findUser = await UserModel.findOne({ email: email });
    if (!findUser) {
      res.render("auth/login.hbs", {
        errorMessage: "No existe el usuario introducido",
      });
      return;
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      res.render("auth/login.hbs", {
        errorMessage: "La contraseña no es correcta.",
      });
      return;
    }

    req.session.user = findUser;
    req.app.locals.userIsActive = true;
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  req.app.locals.userIsActive = false;
  res.redirect("/auth/login");
});

module.exports = router;
