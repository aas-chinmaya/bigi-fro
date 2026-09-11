// ============================================================
// SANITIZATION HELPERS
//
// Lightweight, dependency-free sanitizers applied inside zod
// `.transform()` calls before data ever reaches the API. These
// protect against stray markup / script injection in free-text
// fields (notes, terms, remarks, descriptions) and normalize
// whitespace so duplicate-looking values don't slip through.
// ============================================================

/** Strips HTML tags and script/style blocks, then collapses whitespace. */
export function sanitizeText(value: unknown): string {
  if (value === null || value === undefined) return "";

  const raw = String(value);

  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sanitizes a single-line field (names, codes) — no newlines allowed. */
export function sanitizeSingleLine(value: unknown): string {
  return sanitizeText(value).replace(/[\r\n]+/g, " ");
}

/** Sanitizes a multi-line field (notes, terms) — newlines preserved. */
export function sanitizeMultiLine(value: unknown): string {
  if (value === null || value === undefined) return "";

  const raw = String(value);

  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .trim();
}

/** Normalizes a phone number down to digits, spaces, and a leading +. */
export function sanitizePhone(value: unknown): string {
  if (!value) return "";
  return String(value).replace(/[^\d+\s-]/g, "").trim();
}

/** Lower-cases and trims an email address. */
export function sanitizeEmail(value: unknown): string {
  if (!value) return "";
  return String(value).trim().toLowerCase();
}

/** Clamps a number into a safe finite range, defaulting invalid input to 0. */
export function sanitizeNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(num)) return 0;
  return Math.min(Math.max(num, min), max);
}
