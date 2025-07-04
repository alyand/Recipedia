import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
const User = model("User", userSchema);
export default User;
