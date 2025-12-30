import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import { LinkController } from "@/controllers/link.controller";
import {
  linkNotFoundSchema,
  redirectParamsSchema,
} from "@/http/schemas/link.schema";

export const linkRoutes = new Hono();
const controller = new LinkController();

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
