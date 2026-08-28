import { z } from "zod";

// ==========================================================
// INVOICE ITEM SCHEMA
//
// Mirrors InvoiceItemFormValues (types/invoice-form.types.ts).
// Line items are computed/read-only in the UI (rates & totals
// come from the product/service picker + tax engine), so this
// schema mainly guards against bad/empty rows rather than
// re-implementing the tax math.
// ==========================================================

export const invoiceItemSchema = z.object({
  id: z.string().optional(),

  productId: z.string().min(1, "Select a product or service."),
  productName: z.string().min(1, "Item name is required."),

  itemCode: z.string().optional().default(""),
  unit: z.string().optional().default(""),
  hsnSacCode: z.string().optional().default(""),

  classification: z.enum(["GOODS", "SERVICES"]),

  quantity: z.coerce
    .number({ invalid_type_error: "Quantity must be a number." })
    .positive("Quantity must be greater than 0."),

  rate: z.coerce
    .number({ invalid_type_error: "Rate must be a number." })
    .nonnegative("Rate cannot be negative."),

  discountType: z.enum(["fixed", "percentage"]),
  discountValue: z.coerce.number().nonnegative().default(0),

  taxableAmount: z.coerce.number().nonnegative().default(0),

  cgst: z.coerce.number().nonnegative().default(0),
  sgst: z.coerce.number().nonnegative().default(0),
  igst: z.coerce.number().nonnegative().default(0),
  cess: z.coerce.number().nonnegative().default(0),

  grandTotal: z.coerce.number().nonnegative().default(0),

  description: z.string().optional(),
});

export type InvoiceItemSchema = z.infer<typeof invoiceItemSchema>;
