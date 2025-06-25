require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const externalRoutes = require("./routes/externalRoutes");
const { subscribe } = require("./events/subscriber");

const app = express();

const MONGODB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT || 8003;

app.use(express.json());

//Route PUBLIC (buat user / frontend)
app.use("/api", externalRoutes);

//Connect ke database dan jalankan subscriber
mongoose.connect(MONGODB_URI).then(() => {
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Review service berjalan di port: ${PORT}`);
    subscribe(); //listener RabbitMQ (user.deleted, recipe.deleted)
  });
});
