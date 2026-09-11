import { z } from "zod";

export const quotationItemSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required"),

  productName: z
    .string()
    .min(1, "Product name is required"),

  description: z
    .string()
    .optional(),

  quantity: z
    .coerce
    .number()
    .positive("Quantity must be greater than 0"),

  rate: z
    .coerce
    .number()
    .min(0, "Rate cannot be negative"),

  discount: z
    .coerce
    .number()
    .min(0, "Discount cannot be negative"),

  tax: z
    .coerce
    .number()
    .min(0, "Tax cannot be negative"),
});

export const quotationSchema = z.object({
  customerId: z
    .string()
    .min(1, "Customer is required"),

  customerName: z
    .string()
    .min(1, "Customer name is required"),

  quotationNumber: z
    .string()
    .optional(),

  quotationDate: z
    .string()
    .min(1, "Quotation date is required"),

  validUntil: z
    .string()
    .optional(),

  items: z
    .array(quotationItemSchema)
    .min(1, "Add at least one item"),

  notes: z
    .string()
    .optional(),

  termsAndConditions: z
    .string()
    .optional(),
});

export type QuotationFormValues =
  z.infer<typeof quotationSchema>;

export type QuotationItemFormValues =
  z.infer<typeof quotationItemSchema>;