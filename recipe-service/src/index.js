require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { subscribe } = require('./events/subscriber');

app.use(express.json());
app.use('/recipes', require('./routes/recipeRoutes'));
app.use('/internal/recipes', require('./routes/internalRoutes'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Recipe service on port ${process.env.PORT}`);
      subscribe();
    });
  });