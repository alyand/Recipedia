import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "secret_dev";

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
