import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };

export default validateRequest;
