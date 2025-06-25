const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authenticate = require("../middleware/auth");

// route publik
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);

// route yang butuh autentikasi
router.post("/", authenticate, recipeController.createRecipe);
router.put("/:id", authenticate, recipeController.updateRecipe);
router.delete("/:id", authenticate, recipeController.deleteRecipe);

module.exports = router;
