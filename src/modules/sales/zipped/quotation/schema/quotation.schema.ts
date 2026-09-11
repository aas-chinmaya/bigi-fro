import { z } from "zod";

import { sanitizeEmail, sanitizeMultiLine, sanitizePhone, sanitizeSingleLine } from "../lib/sanitize";
import { quotationItemSchema } from "./quotation-item.schema";

const sanitizedLine = (max: number, message?: string) =>
  z
    .string()
    .optional()
    .transform((val) => sanitizeSingleLine(val ?? ""))
    .pipe(z.string().max(max, message ?? `Must be under ${max} characters`));

const sanitizedNote = (max: number) =>
  z
    .string()
    .optional()
    .transform((val) => sanitizeMultiLine(val ?? ""))
    .pipe(z.string().max(max, `Must be under ${max} characters`));

export const quotationSchema = z
  .object({
    // ----------------------------------------------------
    // Basic information
    // ----------------------------------------------------
    quotationNumber: sanitizedLine(50).optional(),

    quotationDate: z
      .string()
      .min(1, "Quotation date is required")
      .refine((val) => !Number.isNaN(new Date(val).getTime()), "Invalid date"),

    validUntil: z
      .string()
      .optional()
      .refine(
        (val) => !val || !Number.isNaN(new Date(val).getTime()),
        "Invalid date",
      ),

    source: z.enum(["MANUAL", "ONLINE", "POS", "OTHER"]).default("MANUAL"),

    // ----------------------------------------------------
    // Customer
    // ----------------------------------------------------
    customerId: z.string().trim().min(1, "Customer is required"),

    customerName: sanitizedLine(150, "Customer name is required").pipe(
      z.string().min(1, "Customer name is required"),
    ),

    customerPhone: z
      .string()
      .optional()
      .transform((val) => sanitizePhone(val ?? ""))
      .pipe(
        z
          .string()
          .max(20)
          .refine(
            (val) => !val || /^[+\d][\d\s-]{6,19}$/.test(val),
            "Enter a valid phone number",
          ),
      ),

    customerEmail: z
      .string()
      .optional()
      .transform((val) => sanitizeEmail(val ?? ""))
      .pipe(
        z
          .string()
          .max(150)
          .refine(
            (val) => !val || z.string().email().safeParse(val).success,
            "Enter a valid email address",
          ),
      ),

    customerGSTIN: sanitizedLine(15).pipe(
      z
        .string()
        .max(15)
        .refine(
          (val) =>
            !val ||
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
          "Enter a valid 15-character GSTIN",
        ),
    ),

    // ----------------------------------------------------
    // Items
    // ----------------------------------------------------
    items: z
      .array(quotationItemSchema)
      .min(1, "Add at least one item to the quotation"),

    // ----------------------------------------------------
    // Terms
    // ----------------------------------------------------
    paymentTerms: z
      .enum(["DUE_ON_RECEIPT", "NET_7", "NET_15", "NET_30", "NET_45", "NET_60"])
      .default("DUE_ON_RECEIPT"),

    notes: sanitizedNote(1000),
    termsAndConditions: sanitizedNote(2000),
    remarks: sanitizedNote(500),
  })
  .superRefine((data, ctx) => {
    if (data.validUntil && data.quotationDate) {
      const from = new Date(data.quotationDate);
      const until = new Date(data.validUntil);

      if (until < from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["validUntil"],
          message: "Valid until date cannot be before the quotation date",
        });
      }
    }

    const seenProducts = new Set<string>();
    data.items.forEach((item, index) => {
      const key = item.productId || item.productName.toLowerCase();
      if (key && seenProducts.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items", index, "productId"],
          message: "This product is already added — update the quantity instead",
        });
      }
      seenProducts.add(key);
    });
  });

export type QuotationFormValues = z.infer<typeof quotationSchema>;

export const defaultQuotationFormValues: QuotationFormValues = {
  quotationNumber: "",
  quotationDate: new Date().toISOString().slice(0, 10),
  validUntil: "",
  source: "MANUAL",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerGSTIN: "",
  items: [],
  paymentTerms: "DUE_ON_RECEIPT",
  notes: "",
  termsAndConditions: "",
  remarks: "",
};
