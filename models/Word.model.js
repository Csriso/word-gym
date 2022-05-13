const mongoose = require("mongoose")

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      unique: true,
      required: true
    },
    audio: {
        type: String
    },
    definition: {
        type: String
    },
    wordSets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "wordSet"
    }]

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
