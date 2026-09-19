import * as authService from "../services/authService.js";

const REFRESH_COOKIE_NAME = "refresh_token";
const REFRESH_COOKIE_PATH = "/api/auth";

//Fonction pour définir les options du cookie de refresh token
function refreshCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: REFRESH_COOKIE_PATH,
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || "30", 10) * 24 * 60 * 60 * 1000,
    };
}

// Fonction pour répondre avec les tokens et l'utilisateur public
async function respondWithSession(res, user, status = 200) {
    const { accessToken, refreshToken } = await authService.issueTokens(user);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
    res.status(status).json({
        success: true,
        accessToken,
        user: authService.toPublicUser(user),
    });
}

// Contrôleurs d'authentification
export async function register(req, res, next) {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ success: false, message: "Champs requis manquants" });
        }

        const user = await authService.registerWithPassword({ email, password, firstname, lastname });
        await respondWithSession(res, user, 201);
    } catch (err) {
        next(err);
    }
}

// Contrôleur de connexion
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
        }

        const user = await authService.loginWithPassword({ email, password });
        await respondWithSession(res, user);
    } catch (err) {
        next(err);
    }
}

// Contrôleur de rafraîchissement du token
export async function refresh(req, res, next) {
    try {
        const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
        if (!rawToken) {
            return res.status(401).json({ success: false, message: "Aucune session active" });
        }

        const { accessToken, refreshToken } = await authService.rotateRefreshToken(rawToken);
        res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
        res.json({ success: true, accessToken });
    } catch (err) {
        res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
        next(err);
    }
}

// Contrôleur de déconnexion
export async function logout(req, res, next) {
    try {
        const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
        if (rawToken) {
            await authService.revokeRefreshToken(rawToken);
        }
        res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

// Contrôleur pour obtenir les informations de l'utilisateur connecté
export function me(req, res) {
    res.json({ success: true, user: authService.toPublicUser(req.user) });
}