import { z } from "zod";

import { invoiceItemSchema } from "./invoice-item.schema";

// ==========================================================
// INVOICE FORM SCHEMA
//
// This replaces the old manual `getRequiredFieldErrors()` in
// invoice-form-utils.ts. It mirrors InvoiceFormValues field
// for field (types/invoice-form.types.ts) and reproduces the
// exact same conditional required-field rules that used to
// live in that function, so validation behaviour is unchanged
// — only the *mechanism* moved to Zod + react-hook-form's
// zodResolver.
//
// RULES (same as before):
//   1. A buyer is required: either an existing customerId is
//      selected, OR a manual buyerName/buyerCompanyName is
//      typed in.
//   2. Place of supply is required.
//   3. If no existing customerId is selected (manual buyer),
//      the billing address (line 1, city, state, pincode) is
//      required too.
// ==========================================================

const optionalString = z.string().optional().default("");

export const invoiceSchema = z
  .object({
    // ----------------------------------------------------
    // Invoice
    // ----------------------------------------------------
    invoiceType: z.enum(["B2B", "B2C", "EXPORT", "SEZ"]),

    invoiceNumber: optionalString,
    // NOTE: not required here — InvoiceDetailsCard auto-fills this with
    // the current date/time on mount, same as before. Kept optional to
    // match the old getRequiredFieldErrors behaviour exactly.
    invoiceDate: optionalString,
    dueDate: optionalString,

    financialYear: optionalString,

    invoiceStatus: z.enum(["Draft", "Pending", "Issued", "Cancelled"]),
    invoiceSource: optionalString,

    branchId: optionalString,
    branch: optionalString,

    // ----------------------------------------------------
    // Customer
    // ----------------------------------------------------
    customerId: optionalString,

    buyerName: optionalString,
    buyerCompanyName: optionalString,

    buyerGSTIN: optionalString,
    buyerPAN: optionalString,

    buyerPhone: optionalString,
    buyerEmail: z
      .union([z.literal(""), z.string().email("Invalid email address.")])
      .optional()
      .default(""),

    buyerType: optionalString,
    buyerContactPerson: optionalString,

    buyerRevCharge: optionalString,

    // ----------------------------------------------------
    // Billing
    // ----------------------------------------------------
    billingAddressLine1: optionalString,
    billingAddressLine2: optionalString,

    billingCity: optionalString,
    billingState: optionalString,
    billingStateCode: optionalString,
    billingPincode: optionalString,
    billingCountry: optionalString,

    // ----------------------------------------------------
    // Shipping
    // ----------------------------------------------------
    sameAsBilling: z.boolean().default(true),

    shippingAddressLine1: optionalString,
    shippingAddressLine2: optionalString,

    shippingCity: optionalString,
    shippingState: optionalString,
    shippingStateCode: optionalString,
    shippingPincode: optionalString,
    shippingCountry: optionalString,

    // ----------------------------------------------------
    // Tax
    // ----------------------------------------------------
    placeOfSupply: optionalString,
    placeOfSupplyCode: optionalString,

    taxType: optionalString,

    reverseCharge: z.boolean().default(false),
    isExport: z.boolean().default(false),
    isSEZ: z.boolean().default(false),

    currency: optionalString,
    exchangeRate: z.coerce.number().positive().default(1),

    discountType: z.enum(["fixed", "percentage"]),

    // ----------------------------------------------------
    // Items
    // ----------------------------------------------------
    items: z.array(invoiceItemSchema).default([]),

    // ----------------------------------------------------
    // Totals (computed by the tax engine, just carried on
    // the form — kept permissive on purpose)
    // ----------------------------------------------------
    totalItems: z.coerce.number().default(0),
    totalQuantity: z.coerce.number().default(0),

    subtotal: z.coerce.number().default(0),
    discountAmount: z.coerce.number().default(0),
    taxableAmount: z.coerce.number().default(0),

    cgstAmount: z.coerce.number().default(0),
    sgstAmount: z.coerce.number().default(0),
    igstAmount: z.coerce.number().default(0),
    cessAmount: z.coerce.number().default(0),

    roundOffAmount: z.coerce.number().default(0),
    grandTotal: z.coerce.number().default(0),

    // ----------------------------------------------------
    // Payment
    // ----------------------------------------------------
    paymentStatus: z.enum([
      "Paid",
      "Pending",
      "Partially Paid",
      "Unpaid",
      "Overdue",
    ]),
    paymentMethod: optionalString,

    paidAmount: z.coerce.number().nonnegative().default(0),
    pendingAmount: z.coerce.number().nonnegative().default(0),

    paymentDate: optionalString,
    transactionId: optionalString,
    receivedAccount: optionalString,

    // ----------------------------------------------------
    // E-Invoice
    // ----------------------------------------------------
    irn: optionalString,
    acknowledgementNumber: optionalString,
    acknowledgementDate: optionalString,

    signedQRCode: optionalString,
    qrCodeImage: optionalString,

    // ----------------------------------------------------
    // Additional
    // ----------------------------------------------------
    notes: optionalString,
    termsAndConditions: optionalString,

    // ----------------------------------------------------
    // Seller (populated from business context, read-only
    // in the UI, but still typed & carried on the form)
    // ----------------------------------------------------
    sellerLegalName: optionalString,
    sellerTradeName: optionalString,

    sellerGSTIN: optionalString,
    sellerPAN: optionalString,

    sellerPhone: optionalString,
    sellerEmail: optionalString,

    sellerAddressLine1: optionalString,
    sellerAddressLine2: optionalString,

    sellerCity: optionalString,
    sellerState: optionalString,
    sellerStateCode: optionalString,
    sellerPincode: optionalString,
    sellerCountry: optionalString,

    // ----------------------------------------------------
    // Context
    // ----------------------------------------------------
    businessId: optionalString,
    createdBy: optionalString,
  })

  // ========================================================
  // CONDITIONAL / CROSS-FIELD RULES
  // (same rules as the old getRequiredFieldErrors)
  // ========================================================
  .superRefine((values, ctx) => {
    const hasCustomer =
      Boolean(values.customerId?.trim()) ||
      Boolean(values.buyerName?.trim()) ||
      Boolean(values.buyerCompanyName?.trim());

    if (!hasCustomer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["buyerName"],
        message: "Buyer is required",
      });
    }

    if (!values.placeOfSupply?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["placeOfSupply"],
        message: "Place of supply is required",
      });
    }

    // Manual (non-catalog) customer needs a typed billing address.
    if (!values.customerId?.trim()) {
      if (!values.billingAddressLine1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billingAddressLine1"],
          message: "Billing address is required",
        });
      }

      if (!values.billingCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billingCity"],
          message: "Billing city is required",
        });
      }

      if (!values.billingState?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billingState"],
          message: "Billing state is required",
        });
      }

      if (!values.billingPincode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billingPincode"],
          message: "Billing pincode is required",
        });
      }
    }
  });

export type InvoiceSchema = z.infer<typeof invoiceSchema>;
