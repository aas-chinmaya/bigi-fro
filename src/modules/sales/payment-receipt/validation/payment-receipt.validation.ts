
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
    // ------------------------------------------------------
    // RECEIPT DATE
    // ------------------------------------------------------

    receiptDate: z
      .string({
        required_error:
          "Receipt date is required",
      })
      .min(
        1,
        "Receipt date is required",
      )
      .refine(
        (v) =>
          /^\d{4}-\d{2}-\d{2}$/.test(v),
        {
          message:
            "Invalid date format",
        },
      ),

    // ------------------------------------------------------
    // RECEIPT TYPE
    // ------------------------------------------------------

    receiptType: z.enum(
      [
        "INVOICE_PAYMENT",
        "CUSTOMER_ADVANCE",
        "OTHER_RECEIPT",
      ],
      {
        required_error:
          "Receipt type is required",

        invalid_type_error:
          "Receipt type is required",
      },
    ),

    // ------------------------------------------------------
    // CUSTOMER
    // ------------------------------------------------------

    customerId: z
      .string({
        required_error:
          "Customer is required",
      })
      .min(
        1,
        "Customer is required",
      ),

    customerName:
      sanitizedOptionalString,

    // ------------------------------------------------------
    // AMOUNT
    // ------------------------------------------------------

    amount: z
      .number({
        required_error:
          "Amount is required",

        invalid_type_error:
          "Amount is required",
      })
      .positive(
        "Amount must be greater than 0",
      ),

    // ------------------------------------------------------
    // PAYMENT METHOD
    // ------------------------------------------------------

    paymentMethod: z.enum(
      [
        "CASH",
        "BANK_TRANSFER",
        "UPI",
        "CHEQUE",
        "CARD",
        "OTHER",
      ],
      {
        required_error:
          "Payment method is required",

        invalid_type_error:
          "Payment method is required",
      },
    ),

    // ------------------------------------------------------
    // REFERENCE NUMBER
    // ------------------------------------------------------

    referenceNo: z
      .string()
      .optional(),

    // ------------------------------------------------------
    // REMARKS
    // ------------------------------------------------------

    remarks:
      sanitizedOptionalString,
  })

  // ========================================================
  // CONDITIONAL VALIDATION
  // ========================================================

  .superRefine((data, ctx) => {
    // ------------------------------------------------------
    // SANITIZE REFERENCE NUMBER
    // ------------------------------------------------------

    if (data.referenceNo) {
      data.referenceNo =
        sanitizeInput(
          data.referenceNo,
        );
    }

    // ------------------------------------------------------
    // REFERENCE REQUIRED FOR NON-CASH PAYMENTS
    // ------------------------------------------------------

    if (
      data.paymentMethod !== "CASH"
    ) {
      const ref =
        data.referenceNo?.trim() ?? "";

      if (!ref) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          message:
            "Reference number is required for this payment method",

          path: [
            "referenceNo",
          ],
        });
      }
    }
  });

// ==========================================================
// FORM TYPES
// ==========================================================

export type PaymentReceiptFormValues =
  z.input<
    typeof paymentReceiptFormSchema
  >;

export type PaymentReceiptFormOutput =
  z.output<
    typeof paymentReceiptFormSchema
  >;
