import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.header("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    const userId = payload.sub;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    res.locals.userId = userId;
    await next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
