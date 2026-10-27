import { Router } from "express";
import authRoutes from "./auth.routes.js";
import notifRoutes from "./notif.routes.js";


const router = Router();

router.use("/auth", authRoutes);// Toutes les routes d'authentification sont regroupées sous le préfixe /api/auth
router.use("/notif", notifRoutes);// Toutes les routes du syteme de notifications sont regroupées sous le préfixe /api/notif

export default router;