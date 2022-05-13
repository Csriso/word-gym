const mongoose = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const wordSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: String,
    words: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Word",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const WordSet = mongoose.model("WordSet", wordSetSchema);

module.exports = WordSet;
