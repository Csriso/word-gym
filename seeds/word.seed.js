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
        console.log("Added words")
        return response
    }
    catch(err){
        console.log(err)
    }

}



const APIurl="https://api.dictionaryapi.dev/api/v2/entries/en/"

const getWordFromApi = (word) =>{

    axios.get(APIurl+word)
    .then((response => {
        return response;
    }))
    .catch((err)=>{
        console.log(err)
    })
}
/*
async function addWordFromApi(word){
    await axios.get(APIurl+word)
    .then((response)=>{
        console.log("Word:" + response.data[0].word)
        console.log("Audio:" + response.data[0].phonetics[0].audio)
        console.log("MeaningsArr: " + response.data[0].meanings)
        return response
    })
    .catch(err => console.log(err))
}
*/
//deleteWords();
//


Promise.allSettled([
    addWords()
]).then(response=>{console.log(response)})
.catch((err)=>{
    console.log(err)
})


/*
getWordFromApi("hello")
.then((response)=>{
    console.log(response)
})
.catch((err)=>{
    console.log(err)
})
*/
/*
axios.get(APIurl+"hello")
    .then((response)=>{
        console.log("Word:" + response.data[0].word)
        console.log("Audio:" + response.data[0].phonetics[0].audio)
        console.log("MeaningsArr: " + response.data[0].meanings)
        return response
    })
    .catch(err => console.log(err))
    */