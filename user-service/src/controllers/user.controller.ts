import { Request, Response, NextFunction } from "express";

async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  // return {
  //   statusCode: 201,
  //   message: "User register successfully",
  //   data: sanitizeUser(newUser),
  // };
}

async function editProfile(req: Request, res: Response, next: NextFunction) {
  // return {
  //   statusCode: 201,
  //   message: "User register successfully",
  //   data: sanitizeUser(newUser),
  // };
}

export { getMyProfile, editProfile };
