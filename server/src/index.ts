import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { connectDB } from "@/db/connection";
import { apiRoutes } from "@/routes";
import { linkRoutes } from "@/routes/link.routes";

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

  app.use("/api", apiRoutes);
  app.use("/", linkRoutes);

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
}

main();
