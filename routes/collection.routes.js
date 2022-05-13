const router = require("express").Router();
const { render, redirect } = require("express/lib/response");
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

router.get("/:id", async (req, res, next) => {
    const { id } = req.params
    try {
      const wordSet = await WordSetModel.findById(id)
      if(String(wordSet.user) !== req.session.user._id){ //|| !wordSet.private
        res.redirect("/collection")
      }
      //console.log("wordset id", id, wordSet)
      //console.log(wordSet)
      res.render("wordset/wordset.hbs", { wordSet });
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/:id", async (req, res, next) => {
    const { id } = req.params
    const { name, words } = req.body
    try {
      const wordSet = await WordSetModel.findById(id);
      if(String(wordSet.user) !== req.session.user._id){
        res.redirect("/collection")
        }
      console.log("wordset id", id, wordSet)
      console.log(wordSet)
      res.render("wordset/wordset.hbs", { wordSet });
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
