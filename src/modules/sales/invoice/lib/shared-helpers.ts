// ==========================================================
// SMALL SHARED HELPERS
// Used by invoice-payload.ts and invoice-form-values.ts
// ==========================================================

export const text = (
  value: unknown,
): string => {
  return String(
    value ?? "",
  ).trim();
};

export const numberValue = (
  value: unknown,
): number => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

export const round = (
  value: number,
): number => {
  return Number(
    value.toFixed(2),
  );
};

export const optionalText = (
  value: unknown,
): string | undefined => {
  const result = text(value);

  return result || undefined;
};
