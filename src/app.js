import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import prisma from "./prisma/client.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import router from "./routes/index.js";

const app = express();

// Sécurité HTTP headers
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || "").split(",").map((s) => s.trim()).filter(Boolean);

// CORS — credentials:true nécessaire pour que le cookie httpOnly du refresh
// token voyage entre le frontend et l'API.
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Logging des requêtes HTTP
app.use(morgan("dev"));

// Parsing du corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Toutes les routes API
app.use("/api", router);
// Route d'accueil
app.get("/", (_req, res) => {
    res.json({
        status: "ok",
        message: "Bienvenue sur l'API CollabTask",
        timestamp: new Date().toISOString(),
    });
});

// Route de test Prisma
app.get("/users", async (_req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json(users);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erreur serveur ",
        });
    }
});

// 404 — route non trouvée
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route non trouvée",
    });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

export default app;
