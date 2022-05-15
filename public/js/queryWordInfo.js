let words = document.querySelectorAll(".wordToQuery");
let wordsArr = [];
words.forEach((elem) => {
  fetch(`/word/findWord/${elem.innerHTML}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let audio = document.querySelector(`#audio-${response.word}`);
      audio.src = response.audio;
    })
    .catch((err) => console.log(err));
});
