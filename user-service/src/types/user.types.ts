import { z } from "zod";
import mongoose from "mongoose";

const objectIdZod = z.custom<mongoose.Types.ObjectId>(
  (val) => {
    return val instanceof mongoose.Types.ObjectId;
  },
  {
    message: "Invalid ObjectId",
  }
);

export const userSchema = z.object({
  _id: objectIdZod,
  fullname: z
    .string()
    .min(2, "Name should have at least 2 characters")
    .refine(
      (value) => /^[a-zA-Z]+([-' ]?[a-zA-Z]+)*$/.test(value),
      "Name should contain only alphabets, spaces, hyphens, or apostrophes"
    )
    .refine(
      (value) => value.trim().split(/\s+/).length >= 2,
      "Please enter both first and last name"
    ),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters and contain a lowercase, uppercase, and number"
    ),
  avatar: z.string().optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.number(),
});

export const inputUserSchema = userSchema.pick({
  fullname: true,
  email: true,
  password: true,
  avatar: true,
});

export const outputUser = userSchema
  .omit({
    password: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
    _id: true,
    __v: true,
  })
  .extend({
    userId: z.string(),
  });

export type userType = z.infer<typeof userSchema>;
export type inputUserType = z.infer<typeof inputUserSchema>;
export type outputUserType = z.infer<typeof outputUser>;
