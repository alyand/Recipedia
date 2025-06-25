const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  steps: [String],
  userId: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
