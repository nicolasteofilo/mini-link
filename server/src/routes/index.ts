import { Hono } from "hono";
import { authRoutes } from "./auth.routes";
import { linkRoutes } from "./link.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/", linkRoutes); // /shorten e /:slug
