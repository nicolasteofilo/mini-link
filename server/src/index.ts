import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { connectDB } from "@/db/connection";
import { apiRoutes } from "@/routes";
import { linkRoutes } from "@/routes/link.routes";
import { apiReference } from '@scalar/express-api-reference'
import { openApiDocument } from "@/docs/openapi";
import { connectRedis, disconnectRedis } from "@/cache/redis";

async function main() {
  await connectDB();
  await connectRedis();
  
  const app = express();
  app.use(express.json());

  app.use(
    "/api",
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.get("/openapi.json", (_req, res) => {
    res.json(openApiDocument);
  });
  app.use(
    "/docs",
    apiReference({
      spec: {
        url: "/openapi.json",
      },
    })
  );
  app.use("/api", apiRoutes);
  app.use("/", linkRoutes);

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📖 API docs available at http://localhost:${env.PORT}/docs`);
  });

  const shutdown = async () => {
    await disconnectRedis();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
