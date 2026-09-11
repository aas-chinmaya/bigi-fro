// ============================================================
// QUOTATION — DOMAIN TYPES
// Single source of truth for enums, entities, and API contracts.
// ============================================================

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type QuotationSource = "MANUAL" | "ONLINE" | "POS" | "OTHER";

export type PaymentTerms =
  | "DUE_ON_RECEIPT"
  | "NET_7"
  | "NET_15"
  | "NET_30"
  | "NET_45"
  | "NET_60";

export type DiscountType = "PERCENTAGE" | "FIXED";

export const QUOTATION_STATUS_OPTIONS: QuotationStatus[] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
];

export const QUOTATION_SOURCE_OPTIONS: QuotationSource[] = [
  "MANUAL",
  "ONLINE",
  "POS",
  "OTHER",
];

export const PAYMENT_TERMS_OPTIONS: {
  value: PaymentTerms;
  label: string;
}[] = [
  { value: "DUE_ON_RECEIPT", label: "Due on Receipt" },
  { value: "NET_7", label: "Net 7 Days" },
  { value: "NET_15", label: "Net 15 Days" },
  { value: "NET_30", label: "Net 30 Days" },
  { value: "NET_45", label: "Net 45 Days" },
  { value: "NET_60", label: "Net 60 Days" },
];

/** Statuses from which a quotation can still be edited. */
export const EDITABLE_STATUSES: QuotationStatus[] = ["DRAFT", "SENT"];

/** Statuses from which a quotation can be converted to an invoice. */
export const CONVERTIBLE_STATUSES: QuotationStatus[] = ["ACCEPTED", "SENT"];

// ------------------------------------------------------------
// Customer (as embedded in a quotation)
// ------------------------------------------------------------

export interface QuotationCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  gstin?: string;
  billingAddress?: string;
}

// ------------------------------------------------------------
// Line item
// ------------------------------------------------------------

export interface QuotationItem {
  id?: string;

  productId?: string;
  productName: string;
  description?: string;

  quantity: number;
  unit?: string;

  rate: number;

  discountType: DiscountType;
  discountValue: number;

  taxRate: number;

  // Derived / server-computed (also recomputed client-side for preview)
  taxableAmount?: number;
  taxAmount?: number;
  amount?: number;
}

// ------------------------------------------------------------
// Quotation entity
// ------------------------------------------------------------

export interface Quotation {
  id: string;

  businessId?: string;
  branchId?: string;

  quotationNumber?: string;
  quotationDate: string;
  validUntil?: string;

  financialYear?: string;

  status: QuotationStatus;
  source?: QuotationSource;

  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerGSTIN?: string;
  customer?: QuotationCustomer;

  items: QuotationItem[];

  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  taxTotal: number;
  roundOff: number;
  grandTotal: number;

  paymentTerms?: PaymentTerms;

  notes?: string;
  termsAndConditions?: string;
  remarks?: string;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// ------------------------------------------------------------
// List query params / pagination / responses
// ------------------------------------------------------------

export interface QuotationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: QuotationStatus;
  source?: QuotationSource;
  customerId?: string;
  branchId?: string;
  financialYear?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface QuotationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QuotationListResponse {
  success: boolean;
  message: string;
  data: Quotation[];
  pagination?: QuotationPagination;
}

export interface QuotationResponse {
  success: boolean;
  message: string;
  data: Quotation;
}

// ------------------------------------------------------------
// Mutation payloads
// ------------------------------------------------------------

export interface QuotationCreatePayload {
  businessId?: string;
  branchId?: string;
  quotationDate: string;
  validUntil?: string;
  customerId: string;
  source?: QuotationSource;
  items: QuotationItem[];
  paymentTerms?: PaymentTerms;
  notes?: string;
  termsAndConditions?: string;
  remarks?: string;
}

export interface QuotationUpdatePayload {
  quotationDate?: string;
  validUntil?: string;
  customerId?: string;
  source?: QuotationSource;
  items?: QuotationItem[];
  paymentTerms?: PaymentTerms;
  notes?: string;
  termsAndConditions?: string;
  remarks?: string;
}

export interface QuotationStatusPayload {
  status: QuotationStatus;
  remarks?: string;
}

export interface QuotationCancelPayload {
  reason?: string;
}

export interface QuotationSendPayload {
  email?: string;
  phone?: string;
  message?: string;
}

export interface QuotationDuplicatePayload {
  quotationDate?: string;
  validUntil?: string;
  customerId?: string;
}

export interface QuotationConvertToInvoicePayload {
  invoiceDate?: string;
  dueDate?: string;
  notes?: string;
}
