const axios = require("axios");

const validateRecipe = async (recipeId) => {
  try {
    const response = await axios.get(
      `http://recipe-service:8002/internal/recipe/${recipeId}`
    );
    console.log("recipe res : ", response);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
module.exports = { validateRecipe };
