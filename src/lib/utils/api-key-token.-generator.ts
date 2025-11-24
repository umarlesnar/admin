import crypto from "crypto";
import bcrypt from "bcryptjs";
export class ApiKeyTokenGenerator {
  static generateByType(
    userType:
      | "SYSTEM"
      | "BOT"
      | "SERVICE"
      | "SERVICE_INTERNAL"
      | "SERVICE_EXTERNAL"
  ) {
    const prefixes = {
      SYSTEM: "kwic_sys_",
      BOT: "kwic_bot_",
      SERVICE: "live_",
      SERVICE_INTERNAL: "svc_int_",
      SERVICE_EXTERNAL: "svc_ext_",
    };

    const randomBytes = crypto.randomBytes(32).toString("hex");
    const token = `${prefixes[userType]}${randomBytes}`;

    // SECURE but SLOW (25ms) - for database storage
    const hashedToken = bcrypt.hashSync(token, 12);

    // FAST but less secure (0.1ms) - for cache verification
    const tokenSignature = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const prefix = token.substring(0, 12);

    return { token, hashedToken, tokenSignature, prefix, userType };
  }

  // SLOW verification - bcrypt (25ms)
  static verifyToken(token: string, hashedToken: string): boolean {
    return bcrypt.compareSync(token, hashedToken); // 25ms
  }

  // FAST verification - SHA256 (0.1ms)
  static verifySignature(token: string, signature: string): boolean {
    const tokenSignature = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(tokenSignature),
      Buffer.from(signature)
    ); // 0.1ms
  }
}