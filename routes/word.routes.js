const router = require("express").Router();
const { getWordFromApi } = require("../utils/getWord");

router.post("/", (req, res, next) => {
  const { word } = req.body;
  console.log(word);
  getWordFromApi(word)
    .then((response) => {
      console.log(response);
      res.render("word/word.hbs", {
        word: response,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (req, res, next) => {
  res.render("word/findWord.hbs");
});

module.exports = router;
