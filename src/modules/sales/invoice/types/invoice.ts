import type {
  InvoiceStatus,
  InvoiceType,
  PaymentStatus,
} from "./invoice.types";

// ============================================================
// INVOICE ITEM (API RESPONSE SHAPE)
//
// Mirrors the item shape produced by lib/invoice-payload.ts
// (toInvoicePayload) and returned by the backend — distinct
// from InvoiceItemFormValues, which is the *form* shape.
// ============================================================

export interface InvoiceApiItem {
  id?: string;

  productId?: string;
  itemId?: string;

  itemName?: string;
  product?: string;
  itemCode?: string;

  unit?: string;
  hsnSacCode?: string;

  classification?: "GOODS" | "SERVICES";

  quantity?: number;
  unitPrice?: number;
  sellingPrice?: number;

  discountType?: "FIXED" | "PERCENTAGE";
  discountValue?: number;
  discountAmount?: number;

  gstRate?: number;

  taxableAmount?: number;

  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cessAmount?: number;

  lineNumber?: number;
  lineTotal?: number;

  description?: string;
}

// ============================================================
// INVOICE (API RESPONSE SHAPE)
//
// The full invoice record as returned by the backend. Used by
// the invoice list/table columns, the view screen, and the PDF
// document. Every field beyond `id`/`items` is optional because
// it comes straight off the API and is always guarded with `??`
// fallbacks in the UI.
// ============================================================

export interface Invoice {
  id: string;

  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  dueDate?: string | null;

  financialYear?: string | null;

  invoiceStatus?: InvoiceStatus | string | null;
  invoiceSource?: string | null;
  invoiceType?: InvoiceType | string | null;

  branchId?: string | null;
  branch?: string | null;

  // ----------------------------------------------------------
  // Customer / Buyer
  // ----------------------------------------------------------

  customerId?: string | null;

  buyerName?: string | null;
  buyerCompanyName?: string | null;

  buyerGSTIN?: string | null;
  buyerPAN?: string | null;

  buyerPhone?: string | null;
  buyerEmail?: string | null;

  buyerType?: string | null;
  buyerContactPerson?: string | null;

  // ----------------------------------------------------------
  // Billing
  // ----------------------------------------------------------

  billingAddressLine1?: string | null;
  billingAddressLine2?: string | null;

  billingCity?: string | null;
  billingState?: string | null;
  billingStateCode?: string | null;
  billingPincode?: string | null;
  billingCountry?: string | null;

  // ----------------------------------------------------------
  // Shipping
  // ----------------------------------------------------------

  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;

  shippingCity?: string | null;
  shippingState?: string | null;
  shippingStateCode?: string | null;
  shippingPincode?: string | null;
  shippingCountry?: string | null;

  // ----------------------------------------------------------
  // Tax
  // ----------------------------------------------------------

  placeOfSupply?: string | null;
  placeOfSupplyCode?: string | null;

  taxType?: string | null;

  currency?: string | null;

  // ----------------------------------------------------------
  // Items & totals
  // ----------------------------------------------------------

  items: InvoiceApiItem[];

  totalItems?: number | null;
  totalQuantity?: number | null;

  subtotal?: number | null;
  discountAmount?: number | null;
  taxableAmount?: number | null;

  cgstAmount?: number | null;
  sgstAmount?: number | null;
  igstAmount?: number | null;
  cessAmount?: number | null;

  roundOffAmount?: number | null;
  grandTotal?: number | null;

  // ----------------------------------------------------------
  // Payment
  // ----------------------------------------------------------

  paymentStatus?: PaymentStatus | string | null;
  paymentMethod?: string | null;
  paymentTerms?: string | null;

  paidAmount?: number | null;
  pendingAmount?: number | null;

  // ----------------------------------------------------------
  // Additional
  // ----------------------------------------------------------

  notes?: string | null;
  termsAndConditions?: string | null;

  // ----------------------------------------------------------
  // Seller
  // ----------------------------------------------------------

  sellerLegalName?: string | null;
  sellerTradeName?: string | null;

  sellerGSTIN?: string | null;
  sellerPAN?: string | null;

  sellerPhone?: string | null;
  sellerEmail?: string | null;

  sellerAddressLine1?: string | null;
  sellerAddressLine2?: string | null;

  sellerCity?: string | null;
  sellerState?: string | null;
  sellerStateCode?: string | null;
  sellerPincode?: string | null;
  sellerCountry?: string | null;

  // ----------------------------------------------------------
  // Timestamps
  // ----------------------------------------------------------

  createdAt?: string | null;
  updatedAt?: string | null;
}
