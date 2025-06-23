const express = require("express");
const app = express();

// From docker compose ENV
const MONGODB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT | "8002";

app.use(express.json());

app.use("/", (req, res) => {
  res.send("Ini review");
});

app.listen(PORT, () => {
  console.log(`Review service berjalan di port: ${PORT}`);
});
