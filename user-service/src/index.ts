import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database";
import UserRouter from "./routes/external/user.route";
import InternalRouter from "./routes/internal/user.route";
import ErrorHandling from "./error/error-handler";
import { getChannel } from "./service/publisher";

dotenv.config();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URL || "";

const app = express();

app.use(express.json());

app.use("/api", UserRouter);

app.use("/internal", InternalRouter);

app.get("/", (req, res) => {
  res.json({ message: `Ini server User` });
});

app.use(ErrorHandling);

await connectDB(MONGO_URI);

await getChannel();

app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}/`);
});
