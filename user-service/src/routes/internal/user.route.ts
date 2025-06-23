import express, { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import User from "../../models/user.model";

const router = express.Router();

async function getUserById(req: Request, res: Response) {
  const userId = req.params.userId;

  const user = await User.findById(userId).select(
    "fullname email avatar deletedAt"
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
}

router.get("/:userId", catchAsync(getUserById));

export default router;
