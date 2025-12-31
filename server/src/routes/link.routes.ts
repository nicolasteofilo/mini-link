import { Router } from "express";
import { LinkController } from "@/controllers/link.controller";
import { redirectParamsSchema } from "@/http/schemas/link.schema";
import { validateParams } from "@/middlewares/validate.middleware";

export const linkRoutes = Router();
const controller = new LinkController();

linkRoutes.get(
  "/:slug",
  validateParams(redirectParamsSchema),
  (req, res) => controller.redirectToLongUrl(req, res)
);
