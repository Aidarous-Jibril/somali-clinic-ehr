// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode ?? 500;

  res.status(status).json({
    message: err.message ?? "Internal server error",
  });
}
