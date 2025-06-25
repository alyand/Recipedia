import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import sanitizeUser from "../utils/sanitizeUser";
import { ClientError } from "../error/ClientError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { publishMessage } from "../service/publisher";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const { ROUTING_KEYS } = require("/app/shared/rabbitmq/events.config.js");

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const USER_DELETE_KEYS = ROUTING_KEYS.USER_DELETED;

async function registerNewUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, fullname } = req.validatedBody;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullname,
    });

    return {
      statusCode: 201,
      message: "User registered successfully",
      data: sanitizeUser(newUser),
    };
  } catch (error) {
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.validatedBody;

  const user = await User.findOne({ email, deletedAt: null });

  if (!user) {
    throw new ClientError("User not found, failed to login", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ClientError("User not found, failed to login", 401);
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2h" });

  return {
    statusCode: 200,
    message: "Login success",
    token,
    user: sanitizeUser(user),
  };
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.userId;

  if (!userId) {
    throw new ClientError("userId is required", 400);
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!updatedUser) {
    throw new ClientError("User not found, delete failed", 404);
  }
  await publishMessage(USER_DELETE_KEYS, { userId });
  return {
    statusCode: 200,
    message: "User deleted successfully",
  };
}

export { registerNewUser, login, deleteAccount };
