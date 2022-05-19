require("../db");

const mongoose = require("mongoose");
const WordModel = require("./models/Word.model");
const WordSetModel = require("./models/WordSet.model");
const UserModel = require("./models/User.model");
const wordArray = require("./words.json");
const { getWordFromApi } = require("./utils/getWord");

const deleteWords = async () => {
  try {
    const response = await WordModel.deleteMany();
    return response;
  } catch (err) {
    //console.log(err);
  }
};

//demo1234
//$2b$12$GcjEQyAkjJlFFx8u1NzXY.nHVVtLAZkSCaO.Ga.HvXW5vxAfvGfaW
const addWordsFromSeed = async (wordsArr) => {
  await UserModel.deleteMany();
  await WordModel.deleteMany();
  await WordSetModel.deleteMany();

  const user = await UserModel.create({
    email: "demo@demo.demo",
    password: "$2b$12$GcjEQyAkjJlFFx8u1NzXY.nHVVtLAZkSCaO.Ga.HvXW5vxAfvGfaW",
    username: "demo User",
    name: "Patata",
    lastName: "Banana",
    active: true,
  });
  //console.log(user);

  wordArray.forEach(async (elem) => {
    let arrayWords = elem.Words.split(", ");
    let actions = arrayWords.map((word) => {
      return getWordFromApi(word);
    });
    let results = await Promise.all(actions);
    let foundWordsArr = [];
    let notFoundWords = [];
    results.forEach((elem, index) => {
      if (elem.audio !== undefined) {
        foundWordsArr.push(elem.word);
      } else {
        notFoundWords.push(wordsArr[index]);
      }
    });

    wordSet = await WordSetModel.create({
      name: elem.name,
      words: foundWordsArr, //wordsArr,
      private: false,
      user: user._id,
      image: elem.image,
    });
  });
};
try {
  addWordsFromSeed(wordArray);
} catch (err) {
  // console.log(err);
}
