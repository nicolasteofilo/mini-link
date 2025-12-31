import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { connectDB } from "@/db/connection";
import { apiRoutes } from "@/routes";
import { linkRoutes } from "@/routes/link.routes";
import { apiReference } from '@scalar/express-api-reference'
import { openApiDocument } from "@/docs/openapi";

async function main() {
  await connectDB();

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
}

main();
