const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewControllers");

//dipake recipe-service buat ambil review based on ID resep
router.get("/by-recipe/:recipeId", reviewController.getReviewsByRecipeId);

//dipake user-service buat ambil review based on ID user
router.get("/by-user/:userId", reviewController.getReviewsByUserId);

//dipake internal buat ambil ringkasan review
router.get("/summary/:recipeId", reviewController.getRecipeSummary);

module.exports = router;