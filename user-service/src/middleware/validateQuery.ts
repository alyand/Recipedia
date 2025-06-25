import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

const validateQuery =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (err: any) {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };

export default validateQuery;
