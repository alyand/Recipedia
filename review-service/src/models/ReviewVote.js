const mongoose = require("mongoose");

const reviewVoteSchema = new mongoose.Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  vote: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ReviewVote", reviewVoteSchema);
