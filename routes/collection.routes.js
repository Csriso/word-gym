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
      const user = req.session.user
    const wordSets = await WordSetModel.find({user: user}).populate('user');;
    res.render("wordset/allsets.hbs", { wordSets, myCollections: true });
  } catch (err) {
    console.log(err);
  }
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("wordset/create.hbs");
});

router.post("/create", isLoggedIn, (req, res, next) => {
    const { name } = req.body;
    let private = false;
    if (req.body.private === "") {
      private = true;
    }
    WordSetModel.create({ name: name, user: req.session.user, private: private })
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
      const wordsStr=wordSet.words.join(", ")
      let checked=""
        if(wordSet.private) checked="checked"
      //console.log("wordset id", id, wordSet)
      //console.log(wordSet)
      res.render("wordset/wordset.hbs", { wordSet, wordsStr, private: checked  });
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/:id", async (req, res, next) => {
    const { id } = req.params
    const { name, words } = req.body
    let private=false;
    if (req.body.private) private=true
    wordsArr = words.split(", ")
    try {
      let wordSet = await WordSetModel.findById(id);
      if(String(wordSet.user) !== req.session.user._id){
        res.redirect("/collection")
        }
      wordSet=await WordSetModel.findByIdAndUpdate(id, {
          words: wordsArr, 
          private,
          name
        
        }, {new: true})
        let checked=""
        if(wordSet.private) checked="checked"
    
      console.log("words: ", words, "wordsArr: ", wordsArr)
      console.log("wordset id", id, wordSet)
      const wordsStr = wordSet.words.join(", ")
      res.render("wordset/wordset.hbs", { 
          wordSet, 
          wordsStr, 
          private: checked
        });
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
