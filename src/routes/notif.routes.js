import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import * as notifController from "../controllers/notifController.js";


const router=Router();

router.post("/create", requireAuth, notifController.create ); //Route pour l'ajout d'une nouvelle notification
router.get("/retrieves",  notifController.retrieves ); //Route pour recupere la liste des notifications d'un utilisateur
router.patch("/setRead", requireAuth, notifController.setRead ); //Route pour marquer un notification comme lu
router.patch("/setAllAsRead",requireAuth, notifController.setAllAsRead); //Route pour marquer toute les notifications d'un utilisateur comme lu
router.delete("/remove",requireAuth, notifController.remove); //Route supprimer une notification
router.delete("/removeAll",requireAuth, notifController.removeAll); //Route pour supprimer toute les notifications d'un utilisateur 
export default router;

