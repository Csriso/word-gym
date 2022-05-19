require("../db")


const mongoose = require("mongoose");
const WordModel = require("../models/Word.model")
const WordSetModel = require("../models/WordSet.model")
const wordArray = require("./words.json")
const { getWordFromApi } = require("../utils/getWord");

const deleteWords = async () => {
    try{
        const response = await WordModel.deleteMany();
        return response
    }
    catch(err){
        console.log(err)
    }
}
const addWordsFromSeed = async (wordsArr, wordSetName) =>{
    let actions = wordsArr.map((word)=>{
        return getWordFromApi(word)
      })
      let results = await Promise.all(actions);
      let foundWordsArr=[]
      let notFoundWords=[]
      results.forEach((elem, index) =>{
        if (elem.audio !== undefined) {
          foundWordsArr.push(elem.word);
        } else {
          notFoundWords.push(wordsArr[index]);
        }
      })
  
      wordSet = await WordSetModel.create(
        {
            name: wordSetName,
            words: foundWordsArr, //wordsArr,
            private: false,
        }
      );
}
addWordsFromSeed(wordArray, "test4")