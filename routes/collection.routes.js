const router = require("express").Router();
const { render } = require("express/lib/response");
const isLoggedIn = require("../middleware/isLoggedIn");
const WordSetModel = require("../models/Wordset.model");

router.get("/", async (req, res, next) => {
  try {
    const wordSets = await WordSetModel.find().populate('user');
    console.log(wordSets)
    res.render("wordset/allsets.hbs", { wordSets });
  } catch (err) {
    console.log(err);
  }
});

router.get("/my", isLoggedIn, async (req, res, next) => {
  try {
    const wordSets = await WordSetModel.find().populate('user');;
    res.render("wordset/allsets.hbs", { wordSets, myCollections: true });
  } catch (err) {
    console.log(err);
  }
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("wordset/create.hbs");
});

router.post("/create", isLoggedIn, (req, res, next) => {
  console.log(req.body);
  const { name } = req.body
  WordSetModel.create( {"name": name, "user": req.session.user})
    .then((response) => {
      res.redirect("/collection/my");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
