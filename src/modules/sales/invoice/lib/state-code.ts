// ==========================================================
// GST STATE CODE MAP + LOOKUP
// Extracted from the old invoice-form-utils.ts (unchanged logic)
// ==========================================================

export const STATE_CODE_MAP: Record<string, string> = {
  "andhra pradesh": "37",
  "arunachal pradesh": "12",
  assam: "18",
  bihar: "10",
  chhattisgarh: "22",
  goa: "30",
  gujarat: "24",
  haryana: "06",
  "himachal pradesh": "02",
  jharkhand: "20",
  karnataka: "29",
  kerala: "32",
  "madhya pradesh": "23",
  maharashtra: "27",
  manipur: "14",
  meghalaya: "17",
  mizoram: "15",
  nagaland: "13",
  odisha: "21",
  punjab: "03",
  rajasthan: "08",
  sikkim: "11",
  "tamil nadu": "33",
  telangana: "36",
  tripura: "16",
  "uttar pradesh": "09",
  uttarakhand: "05",
  "west bengal": "19",

  "andaman and nicobar islands": "35",
  chandigarh: "04",
  "dadra and nagar haveli and daman and diu": "26",
  delhi: "07",
  "jammu and kashmir": "01",
  ladakh: "38",
  lakshadweep: "31",
  puducherry: "34",
};

// ==========================================================
// STATE CODE
// ==========================================================

export function getStateCode(
  state?: string | null,
  fallbackCode?: string | null,
): string {
  const fallback = String(
    fallbackCode ?? "",
  ).trim();

  if (fallback) {
    return fallback;
  }

  const normalizedState = String(
    state ?? "",
  )
    .trim()
    .toLowerCase();

  if (!normalizedState) {
    return "";
  }

  return STATE_CODE_MAP[
    normalizedState
  ] ?? "";
}
