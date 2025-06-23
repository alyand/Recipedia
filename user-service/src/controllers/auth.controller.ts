import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import sanitizeUser from "../utils/sanitizeUser";
import { ClientError } from "../error/ClientError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

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

  const user = await User.findOne({ email });

  if (!user) {
    throw new ClientError("Email not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ClientError("Password is wrong", 401);
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  return {
    statusCode: 200,
    message: "Login success",
    token,
    user: sanitizeUser(user),
  };
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId;

  if (!userId) {
    throw new ClientError("userId is required", 400);
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!updatedUser) {
    throw new ClientError("User not found, update failed", 404);
  }

  return {
    statusCode: 200,
    message: "User updated successfully",
    data: sanitizeUser(updatedUser),
  };
}

export { registerNewUser, login, deleteAccount };
