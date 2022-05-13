const router = require("express").Router();
const { render } = require("express/lib/response");
const isLoggedIn = require("../middleware/isLoggedIn");
const WordSetModel = require("../models/Wordset.model");

router.get("/", async (req, res, next) => {
  try {
    const wordSets = await WordSetModel.find();
    res.render("wordset/allsets.hbs", { wordSets });
  } catch (err) {
    console.log(err);
  }
});

router.get("/my", isLoggedIn, async (req, res, next) => {
  try {
    const wordSets = await WordSetModel.find();
    res.render("wordset/allsets.hbs", { wordSets, myCollections: true });
  } catch (err) {
    console.log(err);
  }
});

router.get("/create", (req, res, next) => {
  res.render("wordset/create.hbs");
});

module.exports = router;
