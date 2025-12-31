import { Hono } from "hono";
import { authRoutes } from "./auth.routes";
import { meRoutes } from "./me.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/me", meRoutes);
