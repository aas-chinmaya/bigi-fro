/** Shared text sanitization for sales modules */

const SAFE_TEXT_RE =
  /<script|javascript:|on\w+\s*=|data:text\/html|<\s*iframe/i;

export function stripControlChars(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}

export function isHarmfulText(s: string): boolean {
  return SAFE_TEXT_RE.test(s);
}

export function sanitizePlainText(s: string, maxLen?: number): string {
  let out = stripControlChars(s);
  if (maxLen != null) out = out.slice(0, maxLen);
  return out;
}

export const SHARED_LIMITS = {
  NAME: 200,
  COMPANY: 200,
  DESCRIPTION: 1000,
  ADDRESS: 300,
  PHONE: 20,
  EMAIL: 254,
} as const;
