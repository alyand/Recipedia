import express from "express";
import {
  deleteAccount,
  registerNewUser,
} from "../../controllers/auth.controller";
import catchAsync from "../../utils/catchAsync";
import validateRequest from "../../middleware/validateBody";
import { inputUserSchema, updateUserSchema } from "../../types/user.types";
import {
  getAllUser,
  getUserById,
  updateUserInfo,
} from "../../controllers/user.controller";

const router = express.Router();

router.post(
  "/new",
  validateRequest(inputUserSchema),
  catchAsync(registerNewUser)
);
router.get("/", catchAsync(getAllUser));
router.get("/:userId", catchAsync(getUserById));
router.patch(
  "/:userId/profile",
  validateRequest(updateUserSchema),
  catchAsync(updateUserInfo)
);
router.delete("/:userId", catchAsync(deleteAccount));

export default router;
