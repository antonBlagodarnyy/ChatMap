import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function jwtCheck(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "no token" });

  jwt.verify(token, process.env.JWT_KEY!);
  console.log(token);
  next();
}
