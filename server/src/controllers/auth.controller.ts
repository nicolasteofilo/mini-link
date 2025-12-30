import type { Context } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { UserModel } from "@/db/models/user";
import { registerSchema, loginSchema } from "@/http/schemas/auth.schema";

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as "7d" | "14d" | "30d" | "60d" | "90d",
  });
}


export class AuthController {
  async register(c: Context) {
    const body = await c.req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ message: "Invalid body", errors: z.treeifyError(parsed.error) }, 400);
    }

    const username = parsed.data.username.trim();
    const email = parsed.data.email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    try {
      const user = await UserModel.create({ username, email, passwordHash });
      const token = signToken(user._id.toString());

      return c.json(
        {
          user: { id: user._id.toString(), email: user.email, username: user.username },
          token,
        },
        201
      );
    } catch (err: any) {
      if (err?.code === 11000) return c.json({ message: "Email already in use" }, 409);
      return c.json({ message: "Internal error" }, 500);
    }
  }

  async login(c: Context) {
    const body = await c.req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ message: "Invalid body", errors: z.treeifyError(parsed.error) }, 400);
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await UserModel.findOne({ email });

    if (!user) return c.json({ message: "Invalid credentials" }, 401);

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) return c.json({ message: "Invalid credentials" }, 401);

    const token = signToken(user._id.toString());

    return c.json({
      user: { id: user._id.toString(), email: user.email },
      token,
    });
  }
}
