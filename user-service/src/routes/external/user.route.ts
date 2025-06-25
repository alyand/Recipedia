import express from "express";
import {
  deleteAccount,
  login,
  registerNewUser,
} from "../../controllers/auth.controller";
import catchAsync from "../../utils/catchAsync";
import validateRequest from "../../middleware/validateBody";
import {
  inputUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../../types/user.types";
import {
  getAllUser,
  getUserById,
  updateUserInfo,
  getMyProfile,
} from "../../controllers/user.controller";
import authMiddleware from "../../middleware/authentication";

const router = express.Router();

router.post("/login", validateRequest(loginUserSchema), catchAsync(login));

router.post(
  "/new",
  validateRequest(inputUserSchema),
  catchAsync(registerNewUser)
);

router.get("/", catchAsync(getAllUser));

router.get("/my", authMiddleware, catchAsync(getMyProfile));

router.patch(
  "/my",
  authMiddleware,
  validateRequest(updateUserSchema),
  catchAsync(updateUserInfo)
);

router.delete("/my", authMiddleware, catchAsync(deleteAccount));

router.get("/:userId", catchAsync(getUserById));

export default router;
