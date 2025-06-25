const express = require("express");
const router = express.Router();
const {createReview, deleteReview, upvoteReview, downvoteReview} = require("../controllers/reviewControllers");
const authenticate = require("../middleware/authenticate");

//public endpoints
router.post("/review", authenticate, createReview);
router.delete("/review/:id",authenticate, deleteReview);

//vote review
router.put("/:reviewId/upvote", authenticate, upvoteReview);
router.put("/:reviewId/downvote", authenticate, downvoteReview);

module.exports = router;