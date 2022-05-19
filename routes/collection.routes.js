const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const uploader = require("../middleware/uploader.js");
const WordSetModel = require("../models/Wordset.model");
const UserModel = require("../models/User.model");
const WordSet = require("../models/Wordset.model");
const { getWordFromApi } = require("../utils/getWord");

router.get("/", async (req, res, next) => {
  try {
    const wordSets = await WordSetModel.find({
      private: false,
      words: { $exists: true, $not: { $size: 0 } },
    })
      .populate("user")
      .lean();

    if (res.locals.user) {
      // console.log("inside!!!!");
      const user = await UserModel.findById(req.session.user._id)
        .select("trainedWordSets")
        .lean();
      let userTrainedWordSets;
      if (
        user &&
        user.trainedWordSets != null &&
        user.trainedWordSets != undefined
      ) {
        userTrainedWordSets = user.trainedWordSets;
        userTrainedWordSets.forEach((userElement) => {
          wordSets.forEach((wordSetElement, index) => {
            if (String(userElement.WordSet) === String(wordSetElement._id)) {
              wordSetElement.trainedTimes = userElement.completedTimes;
            }
          });
        });
      }
    }
    //res.locals.noEdit="hola";
    const noEdit = "hola";
    res.render("wordset/allsets.hbs", { wordSets, noEdit: "Noedit" });
  } catch (err) {
    //console.log(err);
    next(err);
  }
});

router.get("/mycollection", isLoggedIn, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.user._id)
      .select("trainedWordSets")
      .lean();
    //console.log("User:", user)
    const userTrainedWordSets = user.trainedWordSets; //.trainedWordSets//req.session.user.trainedWordSets;
    //console.log("trained WordSets: ", userTrainedWordSets)
    const wordSets = await WordSetModel.find({ user: req.session.user })
      .populate("user")
      .lean();

    wordSets.forEach((element) => {
      if (element.words.length < 2) element.empty = true;
    });

    userTrainedWordSets.forEach((userElement) => {
      wordSets.forEach((wordSetElement, index) => {
        if (String(userElement.WordSet) === String(wordSetElement._id)) {
          wordSetElement.trainedTimes = userElement.completedTimes;
        }
      });
    });
    //console.log(wordSets);
    res.render("wordset/allsets.hbs", {
      wordSets,
      myCollections: true,
      user: req.session.user,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/delete", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  console.log("BORRO");
  try {
    const user = req.session.user;
    const wordSet = await WordSetModel.find({ user: user, _id: id });

    if (String(wordSet[0].user) === req.session.user._id) {
      await WordSetModel.findByIdAndDelete(id);
    }
    res.redirect("/collection/mycollection");
  } catch (err) {
    console.log(err);
    next(err);
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
      //console.log(err);
      next(err);
    });
});

router.post(
  "/:id/uploadImage",
  isLoggedIn,
  uploader.single("image"),
  async (req, res, next) => {
    const { id } = req.params;

    //console.log("intentando subir imagen", req.file);
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
      //console.log(err);
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
    if (wordSet.private) {
      //|| !wordSet.private
      res.redirect("/collection");
    }
    //console.log({ wordSet });
    res.render("wordset/train.hbs", {
      wordSet,
      noHeader: true,
      fullSize: true,
    });
  } catch (err) {
    //console.log(err);
    next(err);
  }
});

router.get("/:id/train/complete", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const wordSet = await WordSetModel.findById(id);
    const userTest = await UserModel.findById(req.session.user._id);
    //console.log("user test: ", userTest);
    if (String(wordSet.user) !== req.session.user._id) {
      //|| !wordSet.private
      res.redirect("/collection");
    }

    const test2 = await UserModel.findOneAndUpdate(
      {
        _id: req.session.user._id,
        "trainedWordSets.WordSet": id,
      },
      {
        $inc: {
          "trainedWordSets.$.completedTimes": 1,
        },
      }
      //{upsert: true},
    );
    if (!test2) {
      userTest.trainedWordSets.push({ completedTimes: 1, WordSet: wordSet });
      userTest.save(function (err, result) {
        // if (err) console.log(err);
        // else console.log(result);
      });
    }
    res.redirect("/collection");
  } catch (err) {
    //console.log(err);
    next(err);
  }
});

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
    //console.log(err);
    next(err);
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
    let notFoundWords = [];
    let foundWordsArr = [];
    /*
    for (let i = 0; i < wordsArr.length; i++) {
      let foundWord = await getWordFromApi(wordsArr[i]);
      if (foundWord.audio !== undefined) {
        foundWordsArr.push(foundWord.word);
      } else {
        notFoundWords.push(wordsArr[i]);
      }
    }
    */
    let actions = wordsArr.map((word) => {
      return getWordFromApi(word);
    });
    let results = await Promise.all(actions);

    results.forEach((elem, index) => {
      if (elem.audio !== undefined) {
        foundWordsArr.push(elem.word);
      } else {
        notFoundWords.push(wordsArr[index]);
      }
    });

    wordSet = await WordSetModel.findByIdAndUpdate(
      id,
      {
        words: foundWordsArr, //wordsArr,
        private,
        name,
      },
      { new: true }
    );
    let checked = "";
    if (wordSet.private) checked = "checked";

    const wordsStr = wordSet.words.join(", ");
    res.render("wordset/wordset.hbs", {
      wordSet,
      wordsStr,
      private: checked,
      notFoundWords,
    });
  } catch (err) {
    //console.log(err);
    next(err);
  }
});

router.get("/:id/edit", isLoggedIn, async (req, res, next) => {
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
    res.render("wordset/editWordset.hbs", {
      wordSet,
      wordsStr,
      private: checked,
      errormsg,
    });
  } catch (err) {
    //console.log(err);
    next(err);
  }
});

router.post("/:id/edit", isLoggedIn, async (req, res, next) => {
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

    //console.log("words: ", words, "wordsArr: ", wordsArr);
    //console.log("wordset id", id, wordSet);
    const wordsStr = wordSet.words.join(", ");
    res.render("wordset/wordset.hbs", {
      wordSet,
      wordsStr,
      private: checked,
    });
  } catch (err) {
    //console.log(err);
    next(err);
  }
});

module.exports = router;
