const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Used by Review Service to get recipe info
router.get("/by-user/:userId", recipeController.getRecipesByUserId);
router.get("/recipe/:id", recipeController.getRecipeById); // for Review service

module.exports = router;
