import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Edge-safe session helpers (JWT only — no node:crypto, no DB), so this module
 * can be imported from middleware as well as server actions/pages.
 */

export const SESSION_COOKIE = "resume_session";
const ISSUER = "resume-admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) return new TextEncoder().encode(secret);

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is not set (or too short). Generate one with `npm run set-password`.",
    );
  }
  // Dev-only fallback so the app runs before secrets are configured.
  console.warn(
    "[auth] AUTH_SECRET not set — using an insecure dev secret. Run `npm run set-password`.",
  );
  return new TextEncoder().encode("dev-insecure-secret-change-me-please");
}

export async function signSession(username: string): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(
  token: string | undefined,
): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
    });
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
