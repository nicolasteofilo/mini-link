import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.email().max(254),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
