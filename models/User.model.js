const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    trainedWordSets: [
      {
        completedTimes: {
          type: Number,
          default: 0,
        },
        WordSet: {
          type: Schema.Types.ObjectId,
          ref: "WordSet",
        },
      },
    ],
    username: String,
    name: String,
    lastName: String,
    avatar: String,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
