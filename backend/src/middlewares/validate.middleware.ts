// // src/middlewares/validate.middleware.ts
// import type { ZodType } from "zod";
// import { Request, Response, NextFunction } from "express";

// export const validate =
//   (schema: ZodType<any>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       schema.parse(req.body); // 🔥 FIX
//       next();
//     } catch (err: any) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: err.errors ?? err,
//       });
//     }
//   };


// src/middlewares/validate.middleware.ts
import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };