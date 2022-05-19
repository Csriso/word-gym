let words = document.querySelectorAll(".wordToQuery");
let wordsArr = [];
words.forEach((elem) => {
  fetch(`/word/findWordTrain/${elem.innerHTML}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let definition = document.querySelector(`#definition-${response.word}`);
      console.log(response);
      definition.innerHTML = response.meanings;
      let audio = document.querySelector(`#audio-${response.word}`);
      audio.src = response.audio;
    })
    .catch((err) => console.log(err));
});
