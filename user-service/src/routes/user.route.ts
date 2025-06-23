import express from "express";
import { registerNewUser } from "../controllers/auth.controller";
import catchAsync from "../utils/catchAsync";
import validateRequest from "../middleware/validateBody";
import { inputUserSchema } from "../types/user.types";

const router = express.Router();

router.post(
  "/user/new",
  validateRequest(inputUserSchema),
  catchAsync(registerNewUser)
);
// router.get("/user/my");

export default router;
