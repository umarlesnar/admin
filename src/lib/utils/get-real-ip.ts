import { NextRequest } from "next/server";

export function getRealIP(req: NextRequest): string {
  // Cloudflare headers (most reliable)
  const cfConnectingIP = req.headers.get("cf-connecting-ip");
  if (cfConnectingIP) return cfConnectingIP;

  // Standard proxy headers
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, get the first one
    return xForwardedFor.split(",")[0].trim();
  }

  // Other common headers
  const xRealIP = req.headers.get("x-real-ip");
  if (xRealIP) return xRealIP;

  const xClientIP = req.headers.get("x-client-ip");
  if (xClientIP) return xClientIP;

  // Fallback to connection IP
  const remoteAddr = req.headers.get("remote-addr");
  if (remoteAddr) return remoteAddr;

  return "unknown";
}
