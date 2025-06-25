const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    recipeId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: String,
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Review", reviewSchema);
