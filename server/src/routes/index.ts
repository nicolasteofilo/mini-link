import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { meRoutes } from "./me.routes";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/me", meRoutes);
