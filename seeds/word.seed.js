require("../db")


const mongoose = require("mongoose");
const WordModel = require("../models/Word.model")
const WordSetModel = require("../models/WordSet.model")
const wordArray = require("./words.json")

const axios = require('axios').default;
const APIurl="https://api.dictionaryapi.dev/api/v2/entries/en/"

const deleteWords = async () => {
    try{
        const response = await WordModel.deleteMany();
        return response
    }
    catch(err){
        console.log(err)
    }
}
const addWordsFromSeed = () => {
        WordSetModel.deleteMany()
        .then((response)=>{
            return WordModel.deleteMany();
        })
        .then((response)=>{
            return WordModel.insertMany(wordArray)
        })
        .then((response)=>{
            console.log("response al 3r then: ", response)
            return WordSetModel.create({name: "testing", words: response})
        })
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            console.log(err)
        })
}

const addWordFromArray = (wordArray) => {
    wordArray.forEach(word => {
        addWord(word)
    })
}


const addWord = (word) => {
    getWordFromApi(word)
    .then((response)=>{
        return WordModel.create(response)
    })
    .then((response)=>{
        console.log(response)
    })
    .catch((err)=>{
        console.log(err)
    })
}

const getWordFromApi = async (word) =>{
    try{
        const response = await axios.get(APIurl+word)
        let phonetic=response.data[0].phonetics.find((elem)=>{
            return elem.audio
        })
        const content = {
            word: response.data[0].word,
            audio: phonetic.audio,
            //meanings: response.data[0].meanings
        }
        return content
    }catch(err){
        console.log(err)
    }
}
/*
Promise.allSettled([
    addWords()
]).then(response=>{})
.catch((err)=>{
    console.log(err)
})
*/
addWordFromArray([
    "Dog", "Cat", "House"
])