// src/types/express/index.d.ts
import { AnyZodObject } from "zod";
// import { UserType } from "../../your/user/type"; // ganti sesuai skema user kamu

declare global {
  namespace Express {
    interface Request {
      //   user?: UserType; // atau 'any' jika belum punya tipe pasti
      validatedBody?: z.infer<AnyZodObject>;
      // validatedQuery?: AnyZodObject;
      validatedQuery?: z.infer<AnyZodObject>;
    }
  }
}
