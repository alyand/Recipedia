const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    recipeId: {type: String, required: true},
    rating: {type: String, required: true},
    comment: String,
    images: [String], //url cloudinary (tp nanti)
    upvote: {type: Number, default: 0},
    downvote: {type: Number, default: 0},
    deletedAt: {type: Date, default: null}
}, {timestamp: true});

module.exports = mongoose.model("Review", reviewSchema);