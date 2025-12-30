import { Hono } from "hono";
import { AuthController } from "@/controllers/auth.controller";

export const authRoutes = new Hono();
const controller = new AuthController();

authRoutes.post("/register", (c) => controller.register(c));
authRoutes.post("/login", (c) => controller.login(c));
