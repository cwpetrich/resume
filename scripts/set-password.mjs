#!/usr/bin/env node
/**
 * Generate the admin credentials env vars for the resume site.
 *
 *   npm run set-password -- "your-password" [username]
 *
 * Prints ADMIN_USERNAME, ADMIN_PASSWORD_HASH, and a fresh AUTH_SECRET. Paste
 * them into your server's .env.local (or the PM2 ecosystem env). The hashing
 * here MUST match lib/auth.ts (scrypt, 64-byte key, "salt:hash").
 */
import { scryptSync, randomBytes } from "node:crypto";

const password = process.argv[2];
const username = process.argv[3] || "admin";

if (!password) {
  console.error('Usage: npm run set-password -- "your-password" [username]');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const passwordHash = `${salt}:${hash}`;
const authSecret = randomBytes(48).toString("base64url");

console.log("\nAdd these to your environment (e.g. .env.local on the server):\n");
console.log(`ADMIN_USERNAME=${username}`);
console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
console.log(`AUTH_SECRET=${authSecret}`);
console.log(
  "\nKeep these secret. Do NOT commit them. Restart the app after setting them.\n",
);
