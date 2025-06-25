const axios = require("axios");

const validateUser = async (userId) => {
  try {
    const response = await axios.get(
      `http://user-service:8001/internal/${userId}`
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

module.exports = { validateUser };
