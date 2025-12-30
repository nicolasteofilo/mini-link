import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number(),
  MONGO_URI: z.string(),
  MONGO_ROOT_USER: z.string(),
  MONGO_ROOT_PASSWORD: z.string(),
  BASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  SLUG_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", z.treeifyError(_env.error));
  throw new Error("Invalid environment variables");
}

export const env = _env.data;