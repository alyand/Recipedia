import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database";
import UserRouter from "./routes/user.route";
import ErrorHandling from "./error/error-handler";

dotenv.config();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URL || "";

const app = express();

app.use(express.json());

app.use(UserRouter);

app.get("/", (req, res) => {
  res.json({ message: `Ini server User` });
});

app.use(ErrorHandling);

await connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}/`);
});
