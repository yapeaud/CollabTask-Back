import prisma from "../prisma/client.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Authentification requise" });
        }

        const payload = verifyAccessToken(header.slice("Bearer ".length));
        const user = await prisma.user.findUnique({ where: { userid: payload.sub } });
        if (!user) {
            return res.status(401).json({ success: false, message: "Utilisateur introuvable" });
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ success: false, message: "Token invalide ou expiré" });
    }
}
