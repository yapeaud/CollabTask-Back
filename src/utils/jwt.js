import jwt from "jsonwebtoken";
import crypto from "crypto";

export function signAccessToken(user) {
    return jwt.sign({ sub: user.userid, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

// Refresh tokens use a selector/verifier pattern: the selector is stored in
// clear (indexed lookup column) and only the hash of the secret is stored,
// so a leaked DB row alone can't be replayed as a valid refresh token.
export function generateRefreshTokenPair() {
    const selector = crypto.randomBytes(16).toString("hex");
    const secret = crypto.randomBytes(32).toString("hex");
    return { selector, secret, token: `${selector}.${secret}` };
}

export function splitRefreshToken(token) {
    const [selector, secret] = String(token).split(".");
    if (!selector || !secret) return null;
    return { selector, secret };
}

export function hashToken(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

export function getRefreshTokenExpiry() {
    const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || "30", 10);
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
