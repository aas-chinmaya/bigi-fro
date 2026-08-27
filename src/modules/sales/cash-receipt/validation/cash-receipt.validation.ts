import { z } from "zod";

/**
 * Pure sanitization — strips HTML, links, scripts, code-like content.
 */
export function sanitizeInput(value: string): string {
  if (!value) return "";

  return (
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;[^&]*&gt;/gi, "")
      .replace(/&lt;|&gt;|&quot;|&#39;|&#x27;|&#\d+;|&amp;/gi, "")
      .replace(/(javascript|vbscript|data)\s*:/gi, "")
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

/** Today's date as YYYY-MM-DD, for <input type="date"> defaults (local time). */
export function todayDateInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** API date/timestamp → YYYY-MM-DD for <input type="date"> */
export function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value.includes("T")) return value.split("T")[0] ?? "";

  const dmy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;

  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return "";
}

const sanitizedOptionalString = z
  .string()
  .optional()
  .transform((val) => {
    if (val == null || val === "") return undefined;
    const cleaned = sanitizeInput(val);
    return cleaned === "" ? undefined : cleaned;
  });

export const cashReceiptFormSchema = z
  .object({
    receiptDate: z
      .string({ required_error: "Receipt date is required" })
      .min(1, "Receipt date is required")
      .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Invalid date format",
      }),

    receiptType: z.enum(
      ["INVOICE_PAYMENT", "CUSTOMER_ADVANCE", "OTHER_RECEIPT"],
      {
        required_error: "Receipt type is required",
        invalid_type_error: "Receipt type is required",
      },
    ),

    customerId: z
      .string({ required_error: "Customer is required" })
      .min(1, "Customer is required"),

    customerName: sanitizedOptionalString,

    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount is required",
      })
      .positive("Amount must be greater than 0"),

    paymentMethod: z.enum(
      ["CASH", "BANK_TRANSFER", "UPI", "CHEQUE", "CARD", "OTHER"],
      {
        required_error: "Payment method is required",
        invalid_type_error: "Payment method is required",
      },
    ),

    referenceNo: z.string().optional(),
    remarks: sanitizedOptionalString,
  })
  .superRefine((data, ctx) => {
    if (data.referenceNo) {
      data.referenceNo = sanitizeInput(data.referenceNo);
    }

    if (data.paymentMethod !== "CASH") {
      const ref = data.referenceNo?.trim() ?? "";
      if (!ref) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Reference number is required for this payment method",
          path: ["referenceNo"],
        });
      }
    }
  });

export type CashReceiptFormValues = z.input<typeof cashReceiptFormSchema>;
export type CashReceiptFormOutput = z.output<typeof cashReceiptFormSchema>;