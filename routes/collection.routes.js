const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const uploader = require("../middleware/uploader.js");
const WordSetModel = require("../models/Wordset.model");
const UserModel = require("../models/User.model");

router.get("/", async (req, res, next) => {
  try {
    const wordSets = await WordSetModel.find({ private: false }).populate(
      "user"
    );
    console.log(wordSets);
    res.render("wordset/allsets.hbs", { wordSets });
  } catch (err) {
    console.log(err);
  }
});

router.get("/mycollection", isLoggedIn, async (req, res, next) => {
  try {
    const user = req.session.user;
    const wordSets = await WordSetModel.find({ user: user }).populate("user");
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
      res.redirect("/collection/myCollection");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post(
  "/:id/uploadImage",
  isLoggedIn,
  uploader.single("image"),
  async (req, res, next) => {
    const { id } = req.params;

    console.log("intentando subir imagen", req.file);
    try {
      const wordSet = await WordSetModel.findById(id);
      if (String(wordSet.user) !== req.session.user._id) {
        //|| !wordSet.private
        res.redirect("/collection");
      }

      await WordSetModel.findByIdAndUpdate(id, {
        image: req.file.path,
      });

      res.redirect(`/collection/${id}`);
    } catch (err) {
      if (!req.file) res.redirect(`/collection/${id}`);
      // if (err.message.indexOf("format") !== -1) {
      //   console.log("entro");
      //   res.render("wordset/wordset.hbs", {
      //     wordSet,
      //     wordsStr,
      //     private: checked,
      //     err: err.message,
      //   });
      //   res.redirect(`/collection/${id}`);
      //   return;
      // }
      next(err);
    }
  }
);

router.get("/:id/train", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;

  try {
    const wordSet = await WordSetModel.findById(id);
    if (String(wordSet.user) !== req.session.user._id) {
      //|| !wordSet.private
      res.redirect("/collection");
    }
    console.log({ wordSet });
    res.render("wordset/train.hbs", {
      wordSet,
      noHeader: true,
      fullSize: true,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/train/test", isLoggedIn, async(req, res, next)=>{
  const { id } = req.params;
  const { completed } = req.body
  try{
    const wordSet = await WordSetModel.findById(id);
    const userTest = await UserModel.findById(req.session.user._id)
    console.log("user test: ",userTest)
    if (String(wordSet.user) !== req.session.user._id) {
      //|| !wordSet.private
      res.redirect("/collection");
    }
    //const user = await UserModel.findById(req.session.user._id)
    //const user = await UserModel.findByIdAndUpdate(req.session.user_id, {$inc : {'completedTimes': 1}}.exec)
    const user = await UserModel.findByIdAndUpdate(req.session.user._id, {trainedWordSets: {'WordSet': id}})
    console.log("TRAIN TEST", user)
    res.redirect("/collection")
  }
  catch(err){
    console.log(err)
  }


})

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { errormsg } = req.query;
  try {
    const wordSet = await WordSetModel.findById(id);
    if (String(wordSet.user) !== req.session.user._id) {
      //|| !wordSet.private
      res.redirect("/collection");
    }

    const wordsStr = wordSet.words.join(", ");
    let checked = "";
    if (wordSet.private) checked = "checked";
    //console.log("wordset id", id, wordSet)
    //console.log(wordSet)
    res.render("wordset/wordset.hbs", {
      wordSet,
      wordsStr,
      private: checked,
      errormsg,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, words } = req.body;
  let private = false;
  if (req.body.private) private = true;
  wordsArr = words.split(", ");
  try {
    let wordSet = await WordSetModel.findById(id);
    if (String(wordSet.user) !== req.session.user._id) {
      res.redirect("/collection");
    }
    wordSet = await WordSetModel.findByIdAndUpdate(
      id,
      {
        words: wordsArr,
        private,
        name,
      },
      { new: true }
    );
    let checked = "";
    if (wordSet.private) checked = "checked";

    console.log("words: ", words, "wordsArr: ", wordsArr);
    console.log("wordset id", id, wordSet);
    const wordsStr = wordSet.words.join(", ");
    res.render("wordset/wordset.hbs", {
      wordSet,
      wordsStr,
      private: checked,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
