import { z } from "zod";

import { sanitizeMultiLine, sanitizeSingleLine } from "../lib/sanitize";

export const discountTypeSchema = z.enum(["PERCENTAGE", "FIXED"]);

export const quotationItemSchema = z
  .object({
    id: z.string().optional(),

    productId: z.string().trim().min(1, "Select a product"),

    productName: z
      .string()
      .transform(sanitizeSingleLine)
      .pipe(z.string().min(1, "Product name is required").max(200)),

    description: z
      .string()
      .optional()
      .transform((val) => sanitizeMultiLine(val ?? ""))
      .pipe(z.string().max(500, "Description is too long")),

    unit: z
      .string()
      .optional()
      .transform((val) => sanitizeSingleLine(val ?? ""))
      .pipe(z.string().max(20).default("")),

    quantity: z.coerce
      .number({ invalid_type_error: "Quantity must be a number" })
      .positive("Quantity must be greater than 0")
      .max(999999, "Quantity is too large"),

    rate: z.coerce
      .number({ invalid_type_error: "Rate must be a number" })
      .min(0, "Rate cannot be negative")
      .max(99999999, "Rate is too large"),

    discountType: discountTypeSchema.default("PERCENTAGE"),

    discountValue: z.coerce
      .number({ invalid_type_error: "Discount must be a number" })
      .min(0, "Discount cannot be negative")
      .default(0),

    taxRate: z.coerce
      .number({ invalid_type_error: "Tax rate must be a number" })
      .min(0, "Tax rate cannot be negative")
      .max(100, "Tax rate cannot exceed 100%")
      .default(0),
  })
  .superRefine((item, ctx) => {
    if (item.discountType === "PERCENTAGE" && item.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%",
      });
    }

    if (item.discountType === "FIXED" && item.discountValue > item.rate * item.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Discount cannot exceed the line amount",
      });
    }
  });

export type QuotationItemFormValues = z.infer<typeof quotationItemSchema>;

export const emptyQuotationItem: QuotationItemFormValues = {
  productId: "",
  productName: "",
  description: "",
  unit: "",
  quantity: 1,
  rate: 0,
  discountType: "PERCENTAGE",
  discountValue: 0,
  taxRate: 0,
};
