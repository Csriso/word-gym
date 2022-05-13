const axios = require("axios").default;
const APIurl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const getWordFromApi = async (word) => {
  try {
    const response = await axios.get(APIurl + word);
    let phonetic = response.data[0].phonetics.find((elem) => {
      return elem.audio;
    });
    const content = {
      word: response.data[0].word,
      audio: phonetic.audio,
      //meanings: response.data[0].meanings
    };
    return content;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getWordFromApi };
