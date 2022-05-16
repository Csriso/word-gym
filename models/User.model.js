const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    trainedWordSets: [{
      completedTimes: Number,    
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
