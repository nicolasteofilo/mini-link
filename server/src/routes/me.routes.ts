import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { LinkController } from "@/controllers/link.controller";

export const meRoutes = Router();
const controller = new LinkController();

meRoutes.get("/links", authMiddleware, (req, res) =>
  controller.listUserLinks(req, res)
);

meRoutes.post("/links", authMiddleware, (req, res) =>
  controller.generateShortLink(req, res)
);
