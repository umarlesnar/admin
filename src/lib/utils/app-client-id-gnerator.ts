import { nanoid } from "nanoid";
import { randomBytes } from "node:crypto";

/**
 * Generates a unique Client ID
 * @returns {string} A unique identifier (nanoid)
 */
export function generateClientId(): string {
  return nanoid(24); // 24 chars is a good balance for collision resistance
}

/**
 * Generates a strong Client Secret
 * @returns {string} A 64-character hex string (256 bits of entropy)
 */
export function generateClientSecret(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Generates a Webhook Signing Secret
 * @returns {string} A secure string prefixed with 'whsec_'
 */
export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(32).toString("hex")}`;
}
