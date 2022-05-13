require("../db")


const mongoose = require("mongoose");
const WordModel = require("../models/Word.model")
const wordArray = require("./words.json")

const axios = require('axios').default;

const deleteWords = async () => {
    try{
        const response = await WordModel.deleteMany();
        return response
    }
    catch(err){
        console.log(err)
    }
}
const addWords = async () => {
    try {
        await WordModel.deleteMany();
        const response = await WordModel.insertMany(wordArray)
        return response
    }
    catch(err){
        console.log(err)
    }

}



const APIurl="https://api.dictionaryapi.dev/api/v2/entries/en/"

const getWordFromApi = async (word) =>{
    try{
        const response = await axios.get(APIurl+word)
        const content = {
            word: response.data[0].word,
            audio: response.data[0].phonetics[0].audio,
            meanings: response.data[0].meanings
        }
        return content
    }catch(err){
        console.log(err)
    }
}

Promise.all([getWordFromApi("Hello")])
.then((response)=>{console.log(response)})


Promise.allSettled([
    addWords()
]).then(response=>{})
.catch((err)=>{
    console.log(err)
})