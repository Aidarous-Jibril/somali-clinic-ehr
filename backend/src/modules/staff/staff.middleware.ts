// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this-in-production";

// export const requireAuth = ( req: Request, res: Response, next: NextFunction ) => {
//   const header = req.headers.authorization;

//   if (!header) {
//     return res.status(401).json({ message: "Missing token" });
//   }

//   const token = header.replace("Bearer ", "");

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };