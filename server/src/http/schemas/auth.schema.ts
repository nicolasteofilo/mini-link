import { z } from "zod";

export const registerSchemaInput = z.object({
  username: z.string().min(2).max(100),
  email: z.email().max(254),
  password: z.string().min(8).max(72),
});

export const loginSchemaInput = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(72),
});

export const registerSchemaOutput = z.object({
  user: z.object({
    id: z.string(),
    username: z.string().min(2).max(100),
    email: z.email().max(254),
  }),
  token: z.string(),
});

export const loginSchemaOutput = z.object({
  token: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchemaInput>;
export type LoginInput = z.infer<typeof loginSchemaInput>;
export type RegisterOutput = z.infer<typeof registerSchemaOutput>;
export type LoginOutput = z.infer<typeof loginSchemaOutput>;
