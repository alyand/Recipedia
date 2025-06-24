const express = require("express");
const router = express.Router();
const {createReview, deleteReview} = require("../controllers/reviewControllers");
const {upvoteReview, downvoteReview} = require("../controllers/reviewVoteControllers");

//public endpoints
router.post("/review", createReview);
router.delete("/review/:id", deleteReview);

//vote review
router.put("/review/:reviewId/upvote", upvoteReview);
router.put("/review/:reviewId/downvote", downvoteReview);

module.exports = router;