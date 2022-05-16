const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    trainedWordSets: [{
      completedTimes: {
        type: Number,
        default: 0,
      },
      WordSet: {
        type: Schema.Types.ObjectId,
        ref: "WordSet",
      }
    }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
