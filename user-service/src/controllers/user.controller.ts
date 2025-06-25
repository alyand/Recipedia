import { Request, Response, NextFunction } from "express";
import sanitizeUser from "../utils/sanitizeUser";
import User from "../models/user.model";
import { ClientError } from "../error/ClientError";

async function getAllUser(req: Request, res: Response, next: NextFunction) {
  const allUser = await User.find({ deletedAt: null }).lean();
  if (!allUser || allUser.length == 0) {
    throw new ClientError("There is no active user", 404);
  }
  const sanitizedUser = allUser.map((item) => {
    return sanitizeUser(item);
  });
  return {
    statusCode: 200,
    data: sanitizedUser,
  };
}

async function getUserById(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId;
  const userData = await User.findOne({ _id: userId, deletedAt: null }).lean();

  if (!userData) {
    throw new ClientError("User not found", 404);
  }

  return {
    statusCode: 200,
    data: sanitizeUser(userData),
  };
}

async function updateUserInfo(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.userId;
  const { fullname, email } = req.validatedBody;

  const userData = await User.findOneAndUpdate(
    { _id: userId },
    { fullname, email },
    { new: true }
  ).lean();

  if (!userData) {
    throw new ClientError("User not found", 404);
  }

  return {
    statusCode: 200,
    data: sanitizeUser(userData),
  };
}

async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.userId;
  const userData = await User.findOne({ _id: userId, deletedAt: null }).lean();

  if (!userData) {
    throw new ClientError("User not found", 404);
  }

  return {
    statusCode: 200,
    data: userData,
  };
}

export { getAllUser, getUserById, updateUserInfo, getMyProfile };
