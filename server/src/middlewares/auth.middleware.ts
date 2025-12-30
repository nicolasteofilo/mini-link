import type { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return c.json({ message: "Unauthorized" }, 401);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    const userId = payload.sub;

    if (!userId) return c.json({ message: "Unauthorized" }, 401);
    c.set("userId", userId);
    await next();
  } catch {
    return c.json({ message: "Unauthorized" }, 401);
  }
};
