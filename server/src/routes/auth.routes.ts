import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";

import { AuthController } from "@/controllers/auth.controller";
import {
  loginSchemaInput,
  loginSchemaOutput,
  registerSchemaInput,
  registerSchemaOutput,
} from "@/http/schemas/auth.schema";

export const authRoutes = new Hono();
const controller = new AuthController();

authRoutes.post(
  "/register",
  describeRoute({
    description: "Register a new user",
    tags: ["Auth"],
    responses: {
      201: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(registerSchemaOutput) },
        },
      },
    },
  }),
  validator("json", registerSchemaInput),
  controller.register
);

authRoutes.post(
  "/login",
  describeRoute({
    description: "Login a user",
    tags: ["Auth"],
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(loginSchemaOutput) },
        },
      },
    },
  }),
  validator("json", loginSchemaInput),
  controller.login
);
