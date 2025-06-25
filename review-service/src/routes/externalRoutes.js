const express = require("express");
const router = express.Router();
const {
  createReview,
  deleteReview,
  upvoteReview,
  downvoteReview,
  getReviewsByRecipeId,
  getRecipeSummary,
  getReviewsByUserId,
} = require("../controllers/reviewControllers");
const authenticate = require("../middleware/authenticate");

router.post("/new", authenticate, createReview);
router.get("/recipe/:recipeId", getReviewsByRecipeId);
router.get("/user/:userId", getReviewsByUserId);
router.get("/summary/:recipeId", getRecipeSummary);
router.delete("/:id", authenticate, deleteReview);

//vote review
router.put("/:reviewId/upvote", authenticate, upvoteReview);
router.put("/:reviewId/downvote", authenticate, downvoteReview);

module.exports = router;
