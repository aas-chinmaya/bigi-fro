// ============================================================
// quotation.schema.ts
// modules/sales/quotation/schemas/quotation.schema.ts
// ============================================================

import { z } from "zod";

// ============================================================
// ENUMS
// ============================================================

export const quotationStatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
]);

export const taxTypeSchema = z.enum([
  "CGST_SGST",
  "IGST",
  "NO_TAX",
]);

export const discountTypeSchema = z.enum([
  "PERCENTAGE",
  "FIXED",
]);

// ============================================================
// CUSTOMER
// ============================================================

export const quotationCustomerSchema = z.object({
  id: z.string(),

  name: z.string(),

  phone: z.string().nullable().optional(),

  email: z.string().email().nullable().optional(),

  gstin: z.string().nullable().optional(),
});

// ============================================================
// QUOTATION ITEM
// ============================================================

export const quotationItemSchema = z.object({
  id: z.string().optional(),

  itemId: z.string().nullable().optional(),

  itemName: z.string().nullable().optional(),

  description: z.string().nullable().optional(),

  quantity: z.number().nonnegative(),

  unit: z.string().nullable().optional(),

  rate: z.number().nonnegative(),

  discount: z.number().nonnegative().optional(),

  discountType: discountTypeSchema.optional(),

  taxRate: z.number().nonnegative().optional(),

  taxAmount: z.number().nonnegative().optional(),

  amount: z.number().nonnegative().optional(),
});

// ============================================================
// QUOTATION
// ============================================================

export const quotationSchema = z.object({
  // ----------------------------------------------------------
  // Identity
  // ----------------------------------------------------------

  id: z.string(),

  businessId: z.string(),

  branchId: z.string().nullable().optional(),

  quotationNumber: z.string().nullable().optional(),

  quotationDate: z.string(),

  validUntil: z.string(),

  financialYear: z.string().nullable().optional(),

  quotationStatus: quotationStatusSchema,

  // ----------------------------------------------------------
  // Business Snapshot
  // ----------------------------------------------------------

  businessName: z.string(),

  businessLegalName: z.string().nullable().optional(),

  businessGSTIN: z.string().nullable().optional(),

  businessPAN: z.string().nullable().optional(),

  businessPhone: z.string().nullable().optional(),

  businessEmail: z.string().email().nullable().optional(),

  businessAddressLine1: z.string().nullable().optional(),

  businessAddressLine2: z.string().nullable().optional(),

  businessCity: z.string().nullable().optional(),

  businessState: z.string().nullable().optional(),

  businessStateCode: z.string().nullable().optional(),

  businessPincode: z.string().nullable().optional(),

  businessCountry: z.string(),

  // ----------------------------------------------------------
  // Prospect Snapshot
  // ----------------------------------------------------------

  prospectName: z.string(),

  prospectCompanyName: z.string().nullable().optional(),

  prospectGSTIN: z.string().nullable().optional(),

  prospectPAN: z.string().nullable().optional(),

  prospectPhone: z.string().nullable().optional(),

  prospectEmail: z.string().email().nullable().optional(),

  prospectAddressLine1: z.string().nullable().optional(),

  prospectAddressLine2: z.string().nullable().optional(),

  prospectCity: z.string().nullable().optional(),

  prospectState: z.string().nullable().optional(),

  prospectStateCode: z.string().nullable().optional(),

  prospectPincode: z.string().nullable().optional(),

  prospectCountry: z.string(),

  // ----------------------------------------------------------
  // Customer
  // ----------------------------------------------------------

  customerId: z.string().nullable().optional(),

  customer: quotationCustomerSchema.nullable().optional(),

  // ----------------------------------------------------------
  // Commercial Details
  // ----------------------------------------------------------

  placeOfSupply: z.string().nullable().optional(),

  placeOfSupplyCode: z.string().nullable().optional(),

  taxType: taxTypeSchema.nullable().optional(),

  reverseCharge: z.boolean(),

  isExport: z.boolean(),

  isSEZ: z.boolean(),

  currency: z.string(),

  exchangeRate: z.number().nullable().optional(),

  // ----------------------------------------------------------
  // Totals
  // ----------------------------------------------------------

  totalItems: z.number().int().nonnegative(),

  totalQuantity: z.number().nonnegative(),

  taxableAmount: z.number().nonnegative(),

  discountAmount: z.number().nonnegative(),

  cgstAmount: z.number().nonnegative(),

  sgstAmount: z.number().nonnegative(),

  igstAmount: z.number().nonnegative(),

  cessAmount: z.number().nonnegative(),

  roundOffAmount: z.number(),

  grandTotal: z.number().nonnegative(),

  // ----------------------------------------------------------
  // Acceptance
  // ----------------------------------------------------------

  acceptedAt: z.string().nullable().optional(),

  acceptedBy: z.string().nullable().optional(),

  // ----------------------------------------------------------
  // Rejection
  // ----------------------------------------------------------

  rejectedAt: z.string().nullable().optional(),

  rejectedBy: z.string().nullable().optional(),

  rejectionReason: z.string().nullable().optional(),

  // ----------------------------------------------------------
  // Additional
  // ----------------------------------------------------------

  notes: z.string().nullable().optional(),

  termsAndConditions: z.string().nullable().optional(),

  printCount: z.number().int().nonnegative(),

  // ----------------------------------------------------------
  // Items
  // ----------------------------------------------------------

  items: z.array(quotationItemSchema),

  // ----------------------------------------------------------
  // Audit
  // ----------------------------------------------------------

  createdBy: z.string(),

  updatedBy: z.string().nullable().optional(),

  createdAt: z.string(),

  updatedAt: z.string(),

  deletedAt: z.string().nullable().optional(),
});

// ============================================================
// CREATE QUOTATION
// ============================================================

export const quotationCreateSchema = z.object({
  businessId: z.string(),

  branchId: z.string().nullable().optional(),

  quotationDate: z.string().min(1, "Quotation date is required"),

  validUntil: z.string().min(1, "Valid until date is required"),

  financialYear: z.string().nullable().optional(),

  // ----------------------------------------------------------
  // Business Snapshot
  // ----------------------------------------------------------

  businessName: z.string().min(1, "Business name is required"),

  businessLegalName: z.string().nullable().optional(),

  businessGSTIN: z.string().nullable().optional(),

  businessPAN: z.string().nullable().optional(),

  businessPhone: z.string().nullable().optional(),

  businessEmail: z
    .string()
    .email("Invalid business email")
    .nullable()
    .optional(),

  businessAddressLine1: z.string().nullable().optional(),

  businessAddressLine2: z.string().nullable().optional(),

  businessCity: z.string().nullable().optional(),

  businessState: z.string().nullable().optional(),

  businessStateCode: z.string().nullable().optional(),

  businessPincode: z.string().nullable().optional(),

  businessCountry: z.string().default("India"),

  // ----------------------------------------------------------
  // Prospect Snapshot
  // ----------------------------------------------------------

  prospectName: z.string().min(1, "Prospect name is required"),

  prospectCompanyName: z.string().nullable().optional(),

  prospectGSTIN: z.string().nullable().optional(),

  prospectPAN: z.string().nullable().optional(),

  prospectPhone: z.string().nullable().optional(),

  prospectEmail: z
    .string()
    .email("Invalid prospect email")
    .nullable()
    .optional(),

  prospectAddressLine1: z.string().nullable().optional(),

  prospectAddressLine2: z.string().nullable().optional(),

  prospectCity: z.string().nullable().optional(),

  prospectState: z.string().nullable().optional(),

  prospectStateCode: z.string().nullable().optional(),

  prospectPincode: z.string().nullable().optional(),

  prospectCountry: z.string().default("India"),

  // ----------------------------------------------------------
  // Customer
  // ----------------------------------------------------------

  customerId: z.string().nullable().optional(),

  // ----------------------------------------------------------
  // Commercial
  // ----------------------------------------------------------

  placeOfSupply: z.string().nullable().optional(),

  placeOfSupplyCode: z.string().nullable().optional(),

  taxType: taxTypeSchema.nullable().optional(),

  reverseCharge: z.boolean().default(false),

  isExport: z.boolean().default(false),

  isSEZ: z.boolean().default(false),

  currency: z.string().default("INR"),

  exchangeRate: z.number().positive().nullable().optional(),

  // ----------------------------------------------------------
  // Items
  // ----------------------------------------------------------

  items: z
    .array(quotationItemSchema)
    .min(1, "At least one quotation item is required"),

  // ----------------------------------------------------------
  // Totals
  // ----------------------------------------------------------

  totalItems: z.number().int().nonnegative().default(0),

  totalQuantity: z.number().nonnegative().default(0),

  taxableAmount: z.number().nonnegative().default(0),

  discountAmount: z.number().nonnegative().default(0),

  cgstAmount: z.number().nonnegative().default(0),

  sgstAmount: z.number().nonnegative().default(0),

  igstAmount: z.number().nonnegative().default(0),

  cessAmount: z.number().nonnegative().default(0),

  roundOffAmount: z.number().default(0),

  grandTotal: z.number().nonnegative().default(0),

  // ----------------------------------------------------------
  // Additional
  // ----------------------------------------------------------

  notes: z.string().nullable().optional(),

  termsAndConditions: z.string().nullable().optional(),

  createdBy: z.string().min(1, "Created by is required"),
});

// ============================================================
// UPDATE QUOTATION
// ============================================================

export const quotationUpdateSchema =
  quotationCreateSchema.partial().extend({
    updatedBy: z.string().optional(),
  });

// ============================================================
// STATUS
// ============================================================

export const quotationStatusSchemaPayload = z.object({
  status: quotationStatusSchema,

  remarks: z.string().optional(),
});

// ============================================================
// CANCEL
// ============================================================

export const quotationCancelSchema = z.object({
  reason: z.string().optional(),
});

// ============================================================
// SEND
// ============================================================

export const quotationSendSchema = z.object({
  email: z.string().email().optional(),

  phone: z.string().optional(),

  message: z.string().optional(),
});

// ============================================================
// DUPLICATE
// ============================================================

export const quotationDuplicateSchema = z.object({
  quotationDate: z.string().optional(),

  validUntil: z.string().optional(),

  customerId: z.string().nullable().optional(),
});

// ============================================================
// CONVERT TO INVOICE
// ============================================================

export const quotationConvertToInvoiceSchema = z.object({
  invoiceDate: z.string().optional(),

  dueDate: z.string().optional(),

  notes: z.string().optional(),
});

// ============================================================
// LIST QUERY
// ============================================================

export const quotationListParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().optional(),

  search: z.string().optional(),

  status: quotationStatusSchema.optional(),

  customerId: z.string().optional(),

  branchId: z.string().optional(),

  financialYear: z.string().optional(),

  fromDate: z.string().optional(),

  toDate: z.string().optional(),

  sortBy: z.string().optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// ============================================================
// API RESPONSE
// ============================================================

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

// ============================================================
// INFERRED TYPES
// ============================================================

export type QuotationSchema = z.infer<typeof quotationSchema>;

export type QuotationCreateSchema = z.infer<
  typeof quotationCreateSchema
>;

export type QuotationUpdateSchema = z.infer<
  typeof quotationUpdateSchema
>;

export type QuotationStatusSchema = z.infer<
  typeof quotationStatusSchemaPayload
>;

export type QuotationCancelSchema = z.infer<
  typeof quotationCancelSchema
>;

export type QuotationSendSchema = z.infer<
  typeof quotationSendSchema
>;

export type QuotationDuplicateSchema = z.infer<
  typeof quotationDuplicateSchema
>;

export type QuotationConvertToInvoiceSchema = z.infer<
  typeof quotationConvertToInvoiceSchema
>;

export type QuotationListParamsSchema = z.infer<
  typeof quotationListParamsSchema
>;