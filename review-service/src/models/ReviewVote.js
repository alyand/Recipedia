const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    reviewId: {type: String, require: true},
    userId: {type: String, require: true},
    vote: {type: String, enum: ["up", "down"], require:true},
    deletedAt: {type: Date, default: null}
}, {timestamp: true});

//biar user tidak vote review yang sama lebih dr sekali
voteSchema.index({reviewId: 1, userId: 1}, {unique: true});

MediaSourceHandle.exports = mongoose.model("ReviewVote", voteSchema);