import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ClientError } from "./ClientError.js";
import mongoose from "mongoose";

const ErrorHandling: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught:", err);

  // Handle custom ClientError
  if (err instanceof ClientError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Mongoose validation errors (e.g. schema validation)
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle duplicate key error (e.g. unique: true violation)
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate key error",
      keyValue: err.keyValue,
    });
  }

  // Handle cast errors (e.g. invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Fallback for other unhandled errors
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default ErrorHandling;
