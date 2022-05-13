const mongoose = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const wordSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: String,
    words: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const WordSet = mongoose.model("WordSet", wordSetSchema);

module.exports = WordSet;
