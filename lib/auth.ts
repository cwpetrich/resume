import "server-only";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
} from "./session";

/**
 * Node-runtime auth: password hashing/verification (scrypt) and session-cookie
 * management. Imported only from server actions / server components — never
 * from middleware (which uses ./session directly).
 */

const KEY_LEN = 64;

/** Produce a "salt:hash" string for storing in ADMIN_PASSWORD_HASH. */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(plain, salt, KEY_LEN);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Validate a login attempt against the configured admin credentials. */
export function checkCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUser || !adminHash) {
    console.error(
      "[auth] ADMIN_USERNAME / ADMIN_PASSWORD_HASH not configured. Run `npm run set-password`.",
    );
    return false;
  }
  // Compare username in constant time too (length-padded) to avoid leaks.
  const userOk =
    username.length === adminUser.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(adminUser));
  const passOk = verifyPassword(password, adminHash);
  // Always evaluate both before returning.
  return userOk && passOk;
}

export async function startSession(username: string) {
  const token = await signSession(username);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function endSession() {
  cookies().delete(SESSION_COOKIE);
}

/** Returns the session payload if the current request is authenticated. */
export async function getCurrentSession() {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

/** Throws if not authenticated — use to guard mutating server actions. */
export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
