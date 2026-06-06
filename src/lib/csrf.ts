import crypto from "crypto";

export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

export function verifyCsrfToken(sessionToken: string | undefined, requestToken: string | undefined): boolean {
  if (!sessionToken || !requestToken) return false;
  return crypto.timingSafeEqual(
    Buffer.from(sessionToken),
    Buffer.from(requestToken)
  );
}
