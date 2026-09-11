// ============================================================
// modules/sales/quotation/components/form/quotation.schema.ts
// ============================================================

import { z } from "zod";

export const quotationItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().nullable().optional(),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  hsnSac: z.string().optional(),
  quantity: z.coerce.number().min(0.01, "Quantity must be > 0"),
  unit: z.string().optional(),
  rate: z.coerce.number().min(0),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  gstRate: z.coerce.number().min(0).optional(),
  cgstAmount: z.coerce.number().optional(),
  sgstAmount: z.coerce.number().optional(),
  igstAmount: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  total: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().optional(),
});

export const quotationSchema = z.object({
  quotationDate: z.string().min(1, "Quotation date is required"),
  validUntil: z.string().optional(),
  status: z.enum([
    "draft",
    "sent",
    "viewed",
    "accepted",
    "rejected",
    "expired",
    "cancelled",
    "converted",
  ]),
  currency: z.string().default("INR"),
  poNumber: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  subtitle: z.string().optional(),

  // From
  fromName: z.string().min(1, "Company name is required"),
  fromEmail: z.string().email().optional().or(z.literal("")),
  fromPhone: z.string().optional(),
  fromGstin: z.string().optional(),
  fromPan: z.string().optional(),
  fromAddressLine1: z.string().optional(),
  fromAddressLine2: z.string().optional(),
  fromCity: z.string().optional(),
  fromState: z.string().optional(),
  fromCountry: z.string().optional(),
  fromPincode: z.string().optional(),
  fromLogoUrl: z.string().optional(),

  // To
  customerId: z.string().nullable().optional(),
  toName: z.string().min(1, "Customer name is required"),
  toEmail: z.string().email().optional().or(z.literal("")),
  toPhone: z.string().optional(),
  toGstin: z.string().optional(),
  toPan: z.string().optional(),
  toContactPerson: z.string().optional(),
  toAddressLine1: z.string().optional(),
  toAddressLine2: z.string().optional(),
  toCity: z.string().optional(),
  toState: z.string().optional(),
  toCountry: z.string().optional(),
  toPincode: z.string().optional(),

  items: z.array(quotationItemSchema).min(1, "At least one item is required"),

  subtotal: z.coerce.number(),
  discountTotal: z.coerce.number(),
  cgstTotal: z.coerce.number(),
  sgstTotal: z.coerce.number(),
  igstTotal: z.coerce.number(),
  taxTotal: z.coerce.number(),
  otherCharges: z.coerce.number(),
  roundOff: z.coerce.number(),
  grandTotal: z.coerce.number(),
  totalInWords: z.string().optional(),

  showBankDetails: z.boolean(),
  bankAccountId: z.string().nullable().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifsc: z.string().optional(),
  accountHolderName: z.string().optional(),

  showUpiDetails: z.boolean(),
  upiId: z.string().optional(),
  upiLinkedBank: z.string().optional(),

  paymentTerms: z.string().optional(),
  paymentInstructions: z.string().optional(),

  signatureType: z.enum(["simple", "digital"]).optional(),
  signatureUrl: z.string().optional(),
  signatureLabel: z.string().optional(),
  authorizedPerson: z.string().optional(),
  designation: z.string().optional(),

  terms: z.array(z.string()),
});

export type QuotationFormValues = z.infer<typeof quotationSchema>;