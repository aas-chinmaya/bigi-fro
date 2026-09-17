import { z } from "zod";

export const quotationStatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
]);

export const taxTypeSchema = z.enum(["INTRA_STATE", "INTER_STATE"]);
export const discountTypeSchema = z.enum(["PERCENTAGE", "FIXED"]);

const optionalEmail = z
  .union([z.string().email("Invalid email"), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

const optionalString = z
  .union([z.string(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

export const quotationItemSchema = z.object({
  id: z.string().optional(),
  itemId: z.string().nullable().optional(),
  itemName: z.string().min(1, "Item name is required"),
  description: optionalString,
  quantity: z.coerce.number().positive("Quantity must be > 0"),
  unit: optionalString,
  rate: z.coerce.number().nonnegative("Rate must be ≥ 0"),
  discount: z.coerce.number().nonnegative().optional().default(0),
  discountType: discountTypeSchema.optional().default("PERCENTAGE"),
  taxRate: z.coerce.number().nonnegative().optional().default(0),
  taxAmount: z.coerce.number().nonnegative().optional().default(0),
  amount: z.coerce.number().nonnegative().optional().default(0),
});

/** Base object — no refinements (safe for .partial()) */
export const quotationBaseSchema = z.object({
  businessId: z.string().min(1, "Business is required"),
  createdBy: z.string().min(1, "Created by is required"),

  branchId: z.string().nullable().optional(),
  quotationDate: z.string().min(1, "Quotation date is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  financialYear: optionalString,

  businessName: z.string().min(1, "Business name is required"),
  businessLegalName: optionalString,
  businessGSTIN: optionalString,
  businessPAN: optionalString,
  businessPhone: optionalString,
  businessEmail: optionalEmail,
  businessAddressLine1: optionalString,
  businessAddressLine2: optionalString,
  businessCity: optionalString,
  businessState: optionalString,
  businessStateCode: optionalString,
  businessPincode: optionalString,
  businessCountry: z.string().default("India"),

  prospectName: z.string().min(1, "Prospect name is required"),
  prospectCompanyName: optionalString,
  prospectGSTIN: optionalString,
  prospectPAN: optionalString,
  prospectPhone: optionalString,
  prospectEmail: optionalEmail,
  prospectAddressLine1: optionalString,
  prospectAddressLine2: optionalString,
  prospectCity: optionalString,
  prospectState: optionalString,
  prospectStateCode: optionalString,
  prospectPincode: optionalString,
  prospectCountry: z.string().default("India"),

  customerId: z.string().nullable().optional(),

  placeOfSupply: optionalString,
  placeOfSupplyCode: optionalString,
  taxType: taxTypeSchema.nullable().optional().default("INTRA_STATE"),
  reverseCharge: z.boolean().default(false),
  isExport: z.boolean().default(false),
  isSEZ: z.boolean().default(false),
  currency: z.string().default("INR"),
  exchangeRate: z.coerce.number().positive().nullable().optional(),

  items: z.array(quotationItemSchema).min(1, "At least one item is required"),

  totalItems: z.coerce.number().int().nonnegative().default(0),
  totalQuantity: z.coerce.number().nonnegative().default(0),
  taxableAmount: z.coerce.number().nonnegative().default(0),
  discountAmount: z.coerce.number().nonnegative().default(0),
  cgstAmount: z.coerce.number().nonnegative().default(0),
  sgstAmount: z.coerce.number().nonnegative().default(0),
  igstAmount: z.coerce.number().nonnegative().default(0),
  cessAmount: z.coerce.number().nonnegative().default(0),
  roundOffAmount: z.coerce.number().default(0),
  grandTotal: z.coerce.number().nonnegative().default(0),

  notes: optionalString,
  termsAndConditions: optionalString,
  signature: z.string().optional(),
});

export const quotationCreateSchema = quotationBaseSchema.superRefine(
  (data, ctx) => {
    if (data.quotationDate && data.validUntil) {
      const from = new Date(data.quotationDate);
      const until = new Date(data.validUntil);
      if (until < from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid until must be on or after quotation date",
          path: ["validUntil"],
        });
      }
    }
  },
);

export const quotationUpdateSchema = quotationBaseSchema.partial().extend({
  updatedBy: z.string().optional(),
});

export const quotationSchema = quotationBaseSchema.extend({
  id: z.string(),
  quotationNumber: z.string().nullable().optional(),
  quotationStatus: quotationStatusSchema,
  printCount: z.number().int().nonnegative(),
  acceptedAt: z.string().nullable().optional(),
  acceptedBy: z.string().nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
  rejectedBy: z.string().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable().optional(),
  customer: z
    .object({
      id: z.string(),
      name: z.string(),
      phone: z.string().nullable().optional(),
      email: z.string().email().nullable().optional(),
      gstin: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  reverseCharge: z.boolean(),
  isExport: z.boolean(),
  isSEZ: z.boolean(),
});

export const quotationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: quotationSchema,
});

export const quotationListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(quotationSchema),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    })
    .optional(),
});

export type QuotationCreateSchema = z.infer<typeof quotationCreateSchema>;
export type QuotationUpdateSchema = z.infer<typeof quotationUpdateSchema>;
export type QuotationSchema = z.infer<typeof quotationSchema>;