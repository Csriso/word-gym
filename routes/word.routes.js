const router = require("express").Router();
const { getWordFromApi } = require("../utils/getWord");
const capitalized = require("../utils/capitalized");

router.post("/", (req, res, next) => {
  const { word } = req.body;
  getWordFromApi(word, true)
    .then((response) => {
      if (response.code) {
        if (response.response.status === 404) {
          res.render("word/findWord.hbs", {
            findError: "Word not found",
          });
        }
      } else {
        response.word = capitalized(response.word);
        console.log({ word: response });
        res.render("word/word.hbs", response);
      }
    })
    .catch((err) => {
      console.log("ENTRO EN EL ERROR", err);
      next(err)
    });
});

router.get("/findWord/:word", (req, res, next) => {
  const { word } = req.params;
  getWordFromApi(word)
    .then((response) => {
      if (response.code) {
        if (response.response.status === 404) {
          res.render("word/findWord.hbs", {
            findError: "Word not found",
          });
        }
      } else {
        response.word = capitalized(response.word);
        res.json(response);
      }
    })
    .catch((err) => {
      console.log("ENTRO EN EL ERROR", err);
      next(err)
    });
});

router.get("/", (req, res, next) => {
  res.render("word/findWord.hbs");
});

module.exports = router;
