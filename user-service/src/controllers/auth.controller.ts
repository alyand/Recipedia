import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import sanitizeUser from "../utils/sanitizeUser";
import { ClientError } from "../error/ClientError";

async function registerNewUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, fullname } = req.validatedBody;

  const newUser = await User.create({
    email,
    password,
    fullname,
  });

  if (!newUser) {
    throw new ClientError("User failed to registered", 400);
  }

  return {
    statusCode: 201,
    message: "User register successfully",
    data: sanitizeUser(newUser),
  };
}

async function login(req: Request, res: Response, next: NextFunction) {
  // return {
  //   statusCode: 201,
  //   message: "User register successfully",
  //   data: sanitizeUser(newUser),
  // };
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  // return {
  //   statusCode: 201,
  //   message: "User register successfully",
  //   data: sanitizeUser(newUser),
  // };
}

export { registerNewUser, deleteAccount };
