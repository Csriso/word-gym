const axios = require("axios").default;
const APIurl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const getWordFromApi = async (word, definitions = null) => {
  try {
    const response = await axios.get(APIurl + word);
    let phonetic = response.data[0].phonetics.find((elem) => {
      return elem.audio;
    });
    if(!phonetic) phonetic = ""
    const content = {
      word: response.data[0].word,
      audio: phonetic.audio,
      //meanings: response.data[0].meanings
    };
    if (definitions != null) {
      content["definitions"] = response.data[0].meanings[0].definitions;
    }
    return content;
  } catch (err) {
    return err;
  }
};

module.exports = { getWordFromApi };
