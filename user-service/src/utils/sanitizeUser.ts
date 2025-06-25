import { outputUserType, userType } from "../types/user.types";

export default function sanitizeUser(user: userType) {
  const sanitizedUser: outputUserType = {
    userId: user._id.toString(),
    fullname: user.fullname,
    email: user.email,
    avatar: user.avatar,
  };

  return sanitizedUser;
}
