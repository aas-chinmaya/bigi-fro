
import { z } from "zod";

// ==========================================================
// SANITIZATION
// ==========================================================

/**
 * Pure sanitization — strips HTML, links, scripts, and
 * code-like content.
 */
export function sanitizeInput(value: string): string {
  if (!value) return "";

  return (
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;[^&]*&gt;/gi, "")
      .replace(
        /&lt;|&gt;|&quot;|&#39;|&#x27;|&#\d+;|&amp;/gi,
        "",
      )
      .replace(
        /(javascript|vbscript|data)\s*:/gi,
        "",
      )
      .replace(/on\w+\s*=/gi, "")
      .replace(/https?:\/\/[^\s]+/gi, "")
      .replace(/www\.[^\s]+/gi, "")
      .replace(/ftp:\/\/[^\s]+/gi, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`]*`/g, "")
      .replace(/[<>"`]/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
  );
}

// ==========================================================
// TODAY DATE
// ==========================================================

/**
 * Today's date as YYYY-MM-DD for
 * <input type="date"> defaults.
 */
export function todayDateInputValue(): string {
  const d = new Date();

  const y = d.getFullYear();

  const m = String(
    d.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    d.getDate(),
  ).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

// ==========================================================
// API DATE → INPUT DATE
// ==========================================================

/**
 * API date/timestamp → YYYY-MM-DD
 * for <input type="date">
 */
export function toDateInputValue(
  value?: string | null,
): string {
  if (!value) return "";

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // ISO timestamp
  if (value.includes("T")) {
    return value.split("T")[0] ?? "";
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmy = value.match(
    /^(\d{2})[-/](\d{2})[-/](\d{4})$/,
  );

  if (dmy) {
    return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  }

  // Fallback
  const d = new Date(value);

  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();

    const m = String(
      d.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      d.getDate(),
    ).padStart(2, "0");

    return `${y}-${m}-${day}`;
  }

  return "";
}

// ==========================================================
// OPTIONAL SANITIZED STRING
// ==========================================================

const sanitizedOptionalString = z
  .string()
  .optional()
  .transform((val) => {
    if (val == null || val === "") {
      return undefined;
    }

    const cleaned = sanitizeInput(val);

    return cleaned === ""
      ? undefined
      : cleaned;
  });

// ==========================================================
// PAYMENT RECEIPT FORM SCHEMA
// ==========================================================

export const paymentReceiptFormSchema = z
  .object({
    businessId: sanitizedOptionalString,
    branchId: sanitizedOptionalString,

    receiptNumber: sanitizedOptionalString,
    receiptDate: z
      .string({ message: "Receipt date is required" })
      .min(1, "Receipt date is required")
      .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Invalid date format",
      }),

    financialYear: z.string().trim().min(1, "Financial year is required"),

    receiptStatus: z.enum(["DRAFT", "RECEIVED"], {
      message: "Receipt status is required",
    }),

    receiptSource: z.enum(["MANUAL", "ONLINE", "OTHER", "POS"], {
      message: "Receipt source is required",
    }),

    customerId: z
      .string({ message: "Customer is required" })
      .min(1, "Customer is required"),

    customerName: z.string().trim().min(1, "Customer name is required"),
    customerPhone: sanitizedOptionalString,
    customerGSTIN: sanitizedOptionalString,

    paymentId: sanitizedOptionalString,
    paymentMethod: z.enum(["CASH", "UPI", "CARD", "NET_BANKING"], {
      message: "Payment method is required",
    }).default("CASH"),
    documentNumber: z.string().trim().default(""),
    amount: z
      .number({
        message: "Amount is required",
      })
      .positive("Amount must be greater than 0"),

    remarks: sanitizedOptionalString,
    notes: sanitizedOptionalString,

    createdBy: z.string().trim().min(1, "Created by is required").optional().or(z.literal("")),
    updatedBy: sanitizedOptionalString,
  });

// ==========================================================
// FORM TYPES
// ==========================================================

export type PaymentReceiptFormValues = z.input<typeof paymentReceiptFormSchema>;

export type PaymentReceiptFormOutput = z.output<typeof paymentReceiptFormSchema>;
