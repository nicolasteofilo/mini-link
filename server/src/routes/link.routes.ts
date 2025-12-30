import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { LinkController } from "@/controllers/link.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createShortLinkSchema,
  createShortLinkSchemaOutput,
  linkNotFoundSchema,
  redirectParamsSchema,
} from "@/http/schemas/link.schema";

export const linkRoutes = new Hono();
const controller = new LinkController();

// público (redirect)
linkRoutes.get(
  "/:slug",
  describeRoute({
    description: "Redirect to the original URL",
    tags: ["Links"],
    responses: {
      302: {
        description: "Redirect to the original URL",
      },
      404: {
        description: "Link not found",
        content: {
          "application/json": { schema: resolver(linkNotFoundSchema) },
        },
      },
    },
  }),
  validator("param", redirectParamsSchema),
  (c) => controller.redirectToLongUrl(c)
);

// protegido (criar link)
linkRoutes.post(
  "/shorten",
  describeRoute({
    description: "Create a short link",
    tags: ["Links"],
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
