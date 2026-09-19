import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);// Route pour l'inscription d'un nouvel utilisateur
router.post("/login", authController.login);// Route pour la connexion d'un utilisateur existant
router.post("/refresh", authController.refresh);// Route pour le rafraîchissement du token
router.post("/logout", authController.logout);// Route pour la déconnexion
router.get("/me", requireAuth, authController.me);// Route pour obtenir les informations de l'utilisateur connecté

export default router;