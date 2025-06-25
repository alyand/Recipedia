require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { subscribe } = require("./events/subscriber");

// From docker-compose ENV
const MONGODB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT || 8002;

app.use(express.json());

app.use("/api", require("./routes/externalRoutes"));
app.use("/internal", require("./routes/internalRoutes"));

mongoose.connect(MONGODB_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Recipe service berjalan di port: ${PORT}`);
    subscribe();
  });
});
