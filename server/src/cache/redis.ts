import { createClient } from "redis";
import { env } from "@/config/env";

let client: ReturnType<typeof createClient> | null = null;

export const connectRedis = async () => {
  if (client) return client;

  client = createClient({
    url: env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  await client.connect();
  return client;
};

export async function disconnectRedis() {
  if (client && client.isOpen) client.destroy();
}