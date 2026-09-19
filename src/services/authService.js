import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import {
    signAccessToken,
    generateRefreshTokenPair,
    splitRefreshToken,
    hashToken,
    getRefreshTokenExpiry,
} from "../utils/jwt.js";

// Service d'authentification
export function toPublicUser(user) {
    const { id, passwordhash, ...rest } = user;
    return rest;
}

// Enregistrement d'un nouvel utilisateur avec email et mot de passe
export async function registerWithPassword({ email, password, firstname, lastname }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        const err = new Error("Un compte existe déjà avec cet email");
        err.status = 409;
        throw err;
    }

    const passwordhash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { email, passwordhash, firstname, lastname },
    });

    return user;
}

// Connexion d'un utilisateur avec email et mot de passe
export async function loginWithPassword({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordhash) {
        const err = new Error("Email ou mot de passe incorrect");
        err.status = 401;
        throw err;
    }

    // Vérification du mot de passe
    const valid = await bcrypt.compare(password, user.passwordhash);
    if (!valid) {
        const err = new Error("Email ou mot de passe incorrect");
        err.status = 401;
        throw err;
    }

    return user;
}

// Émission de tokens d'accès et de rafraîchissement
export async function issueTokens(user) {
    const accessToken = signAccessToken(user);
    const { selector, secret, token: refreshToken } = generateRefreshTokenPair();

    await prisma.refreshToken.create({
        data: {
            refreshtoken: selector,
            tokenhash: hashToken(secret),
            userid: user.userid,
            expiresat: getRefreshTokenExpiry(),
        },
    });

    return { accessToken, refreshToken };
}

// Rotation du refresh token : on vérifie le token existant, on le révoque et on en émet un nouveau
export async function rotateRefreshToken(rawToken) {
    const parts = splitRefreshToken(rawToken);
    if (!parts) {
        const err = new Error("Refresh token invalide");
        err.status = 401;
        throw err;
    }

    const record = await prisma.refreshToken.findUnique({
        where: { refreshtoken: parts.selector },
        include: { user: true },
    });

    if (
        !record ||
        record.revokedat ||
        record.expiresat < new Date() ||
        record.tokenhash !== hashToken(parts.secret)
    ) {
        const err = new Error("Refresh token invalide ou expiré");
        err.status = 401;
        throw err;
    }

    // Rotation : on révoque l'ancien token et on en émet un nouveau.
    await prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedat: new Date() },
    });

    return issueTokens(record.user);
}

// Révocation d'un refresh token
export async function revokeRefreshToken(rawToken) {
    const parts = splitRefreshToken(rawToken);
    if (!parts) return;

    await prisma.refreshToken
        .updateMany({
            where: { refreshtoken: parts.selector, revokedat: null },
            data: { revokedat: new Date() },
        })
        .catch(() => {});
}