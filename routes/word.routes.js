const router = require("express").Router();
const { getWordFromApi } = require("../utils/getWord");

router.get("/:word", (req, res, next) => {
  const { word } = req.params;
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

module.exports = router;
