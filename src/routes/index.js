import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);// Toutes les routes d'authentification sont regroupées sous le préfixe /api/auth

export default router;