require("../db")

const WordModel = require("../models/Word.model")
const wordArray = require("./words.json")

const deleteWords = async () => {
    try{
        await WordModel.deleteMany();
    }
    catch(err){
        console.log(err)
    }
}
const addWords = async () => {
    try {
        await WordModel.insertMany(wordArray)
        console.log("Added words")
    }
    catch(err) {
        console.log(err)
    }
}

deleteWords();
addWords();
