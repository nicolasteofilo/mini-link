import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "@/config/env";
import { connectDB } from "@/db/connection";
import { apiRoutes } from "@/routes";
import { openAPIRouteHandler } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";

async function main() {
  await connectDB();

  const app = new Hono();

  app.use(
    "/api/*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.route("/api", apiRoutes);
  app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: "MiniLink - An minimal URL Shortener API",
          version: "1.0.0",
          description:
            "This is the OpenAPI specification for the MiniLink API, a minimal URL shortener service.",
        },
        servers: [
          { url: "http://localhost:3000", description: "Local Server" },
        ],
      },
    })
  );

  app.get("/docs", Scalar({ url: "/openapi.json" }));

  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`🚀 Server running on http://localhost:${info.port}`);
    console.log(`📖 API docs available at http://localhost:${info.port}/docs`);
  });
}

main();
