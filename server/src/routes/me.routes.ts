import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { LinkController } from "@/controllers/link.controller";
import {
  createShortLinkSchema,
  createShortLinkSchemaOutput,
  meLinksSchemaOutput,
} from "@/http/schemas/link.schema";

export const meRoutes = new Hono();
const controller = new LinkController();

meRoutes.get(
  "/links",
  describeRoute({
    description: "List links created by the authenticated user",
    tags: ["Me"],
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(meLinksSchemaOutput) },
        },
      },
    },
  }),
  authMiddleware,
  (c) => controller.listUserLinks(c)
);

meRoutes.post(
  "/links",
  describeRoute({
    description: "Create a short link",
    tags: ["Me"],
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(createShortLinkSchemaOutput) },
        },
      },
    },
  }),
  authMiddleware,
  validator("json", createShortLinkSchema),
  (c) => controller.generateShortLink(c)
);
