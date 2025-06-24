const { validateUser } = require("../utils/validateUser");
const Recipe = require("../models/Recipe");
const { publishEvent } = require("../events/publisher");
const { ROUTING_KEYS } = require("/app/shared/rabbitmq/events.config.js");

// GET all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal mengambil resep", detail: err.message });
  }
};

// GET by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Resep tidak ditemukan." });
    }
    res.json(recipe);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal mengambil resep", detail: err.message });
  }
};

// GET recipes by user ID
exports.getRecipesByUserId = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.params.userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({
      error: "Gagal mengambil resep berdasarkan user ID",
      detail: err.message,
    });
  }
};

// CREATE
exports.createRecipe = async (req, res) => {
  const { userId, title, description, ingredients, steps } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userID is null" });
  }
  try {
    const isUserValid = await validateUser(userId);
    if (!isUserValid) {
      return res
        .status(400)
        .json({ error: "User ID tidak valid atau tidak ditemukan." });
    }

    const newRecipe = new Recipe({
      userId,
      title,
      description,
      ingredients,
      steps,
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: "Gagal membuat resep", detail: err.message });
  }
};

// UPDATE
exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Resep tidak ditemukan." });
    }
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal memperbarui resep", detail: err.message });
  }
};

// DELETE
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Resep tidak ditemukan." });
    }

    // Publish event ke RabbitMQ
    await publishEvent(ROUTING_KEYS.RECIPE_DELETED, { recipeId: deleted._id });
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Gagal menghapus resep", detail: err.message });
  }
};
