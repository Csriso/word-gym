const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

// @desc    Profile User
// @route   GET /auth/profile
// @access  Private
router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile.hbs", { user: req.session.user });
});

router.post("/profile", isLoggedIn, async (req, res, next) => {
  const { username, name, lastName } = req.params;

  try {
    const updateUser = await UserModel.findByIdAndUpdate(id, req.params);
    res.redirect("/auth/profile");
  } catch (err) {
    console.log(err);
  }
});
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

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  req.app.locals.userIsActive = false;
  req.app.locals.activeUser = undefined;

  res.redirect("/auth/login");
});

module.exports = router;
