import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "@/config/env";
import { connectDB } from "@/db/connection";
import { apiRoutes } from "@/routes";

async function main() {
  await connectDB();

  const app = new Hono();

  app.use("/api/*", cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }));

  app.route("/api", apiRoutes);

  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
  });
}

main();
