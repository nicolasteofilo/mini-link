import type { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { UserModel } from "@/db/models/user";
import { registerSchemaInput, loginSchemaInput } from "@/http/schemas/auth.schema";

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as "7d" | "14d" | "30d" | "60d" | "90d",
  });
}


export class AuthController {
  async register(req: Request, res: Response) {
    const body = req.body ?? null;
    const parsed = registerSchemaInput.safeParse(body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid body", errors: z.treeifyError(parsed.error) });
    }

    const username = parsed.data.username.trim();
    const email = parsed.data.email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    try {
      const user = await UserModel.create({ username, email, passwordHash });
      const token = signToken(user._id.toString());

      return res.status(201).json(
        {
          user: { id: user._id.toString(), email: user.email, username: user.username },
          token,
        }
      );
    } catch (err: any) {
      if (err?.code === 11000) return res.status(409).json({ message: "Email already in use" });
      return res.status(500).json({ message: "Internal error" });
    }
  }

  async login(req: Request, res: Response) {
    const body = req.body ?? null;
    const parsed = loginSchemaInput.safeParse(body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid body", errors: z.treeifyError(parsed.error) });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id.toString());

    return res.json({
      user: { id: user._id.toString(), email: user.email },
      token,
    });
  }
}
