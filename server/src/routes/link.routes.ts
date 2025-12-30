import { Hono } from "hono";
import { LinkController } from "@/controllers/link.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

export const linkRoutes = new Hono();
const controller = new LinkController();

// público (redirect)
linkRoutes.get("/:slug", (c) => controller.redirectToLongUrl(c));

// protegido (criar link)
linkRoutes.post("/shorten", authMiddleware, (c) => controller.generateShortLink(c));
