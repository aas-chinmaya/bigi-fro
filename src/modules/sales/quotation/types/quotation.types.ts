// ============================================================
// QUOTATION TYPES
// modules/sales/quotation/types/quotation.types.ts
// ============================================================

// --------------------
// ENUMS
// --------------------

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type ReceiptSource =
  | "MANUAL"
  | "ONLINE"
  | "POS"
  | "OTHER";

export type DiscountType =
  | "PERCENTAGE"
  | "FIXED";

export type TaxType =
  | "CGST_SGST"
  | "IGST"
  | "NO_TAX";


// ============================================================
// CUSTOMER
// ============================================================

export interface QuotationCustomer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  gstin?: string | null;
}


// ============================================================
// QUOTATION ITEM
// ============================================================

export interface QuotationItem {
  id?: string;

  itemId?: string | null;
  itemName?: string | null;
  description?: string | null;

  quantity: number;
  unit?: string | null;

  rate: number;

  discount?: number;
  discountType?: DiscountType;

  taxRate?: number;
  taxAmount?: number;

  amount?: number;
}


// ============================================================
// MAIN QUOTATION
// ============================================================

export interface Quotation {
  id: string;

  businessId: string;
  branchId?: string | null;

  quotationNumber?: string | null;
  quotationDate: string;
  validUntil: string;

  financialYear?: string | null;

  quotationStatus: QuotationStatus;

  // ----------------------------------------------------------
  // Quotation From - Business Snapshot
  // ----------------------------------------------------------

  businessName: string;
  businessLegalName?: string | null;
  businessGSTIN?: string | null;
  businessPAN?: string | null;

  businessPhone?: string | null;
  businessEmail?: string | null;

  businessAddressLine1?: string | null;
  businessAddressLine2?: string | null;
  businessCity?: string | null;
  businessState?: string | null;
  businessStateCode?: string | null;
  businessPincode?: string | null;
  businessCountry: string;

  // ----------------------------------------------------------
  // Quotation To - Prospect Snapshot
  // ----------------------------------------------------------

  prospectName: string;
  prospectCompanyName?: string | null;
  prospectGSTIN?: string | null;
  prospectPAN?: string | null;

  prospectPhone?: string | null;
  prospectEmail?: string | null;

  prospectAddressLine1?: string | null;
  prospectAddressLine2?: string | null;
  prospectCity?: string | null;
  prospectState?: string | null;
  prospectStateCode?: string | null;
  prospectPincode?: string | null;
  prospectCountry: string;

  // ----------------------------------------------------------
  // Customer
  // ----------------------------------------------------------

  customerId?: string | null;
  customer?: QuotationCustomer | null;

  // ----------------------------------------------------------
  // Commercial Details
  // ----------------------------------------------------------

  placeOfSupply?: string | null;
  placeOfSupplyCode?: string | null;

  taxType?: TaxType | null;

  reverseCharge: boolean;
  isExport: boolean;
  isSEZ: boolean;

  currency: string;
  exchangeRate?: number | null;

  // ----------------------------------------------------------
  // Totals
  // ----------------------------------------------------------

  totalItems: number;
  totalQuantity: number;

  taxableAmount: number;
  discountAmount: number;

  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;

  roundOffAmount: number;
  grandTotal: number;

  // ----------------------------------------------------------
  // Acceptance
  // ----------------------------------------------------------

  acceptedAt?: string | null;
  acceptedBy?: string | null;

  // ----------------------------------------------------------
  // Rejection
  // ----------------------------------------------------------

  rejectedAt?: string | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;

  // ----------------------------------------------------------
  // Additional
  // ----------------------------------------------------------

  notes?: string | null;
  termsAndConditions?: string | null;

  printCount: number;

  // ----------------------------------------------------------
  // Items
  // ----------------------------------------------------------

  items: QuotationItem[];

  // ----------------------------------------------------------
  // Audit
  // ----------------------------------------------------------

  createdBy: string;
  updatedBy?: string | null;

  createdAt: string;
  updatedAt: string;

  deletedAt?: string | null;
}


// ============================================================
// LIST QUERY PARAMETERS
// ============================================================

export interface QuotationListParams {
  page?: number;
  limit?: number;

  search?: string;

  status?: QuotationStatus;
  customerId?: string;
  branchId?: string;

  financialYear?: string;

  fromDate?: string;
  toDate?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


// ============================================================
// PAGINATION
// ============================================================

export interface QuotationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


// ============================================================
// API RESPONSES
// ============================================================

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


// ============================================================
// CREATE QUOTATION
// ============================================================

export interface QuotationCreatePayload {
  businessId: string;
  branchId?: string | null;

  quotationDate: string;
  validUntil: string;

  financialYear?: string | null;

  // Business snapshot
  businessName: string;
  businessLegalName?: string | null;
  businessGSTIN?: string | null;
  businessPAN?: string | null;
  businessPhone?: string | null;
  businessEmail?: string | null;

  businessAddressLine1?: string | null;
  businessAddressLine2?: string | null;
  businessCity?: string | null;
  businessState?: string | null;
  businessStateCode?: string | null;
  businessPincode?: string | null;
  businessCountry?: string;

  // Prospect snapshot
  prospectName: string;
  prospectCompanyName?: string | null;
  prospectGSTIN?: string | null;
  prospectPAN?: string | null;
  prospectPhone?: string | null;
  prospectEmail?: string | null;

  prospectAddressLine1?: string | null;
  prospectAddressLine2?: string | null;
  prospectCity?: string | null;
  prospectState?: string | null;
  prospectStateCode?: string | null;
  prospectPincode?: string | null;
  prospectCountry?: string;

  // Customer
  customerId?: string | null;

  // Commercial
  placeOfSupply?: string | null;
  placeOfSupplyCode?: string | null;

  taxType?: TaxType | null;

  reverseCharge?: boolean;
  isExport?: boolean;
  isSEZ?: boolean;

  currency?: string;
  exchangeRate?: number | null;

  // Items
  items: QuotationItem[];

  // Totals
  totalItems?: number;
  totalQuantity?: number;

  taxableAmount?: number;
  discountAmount?: number;

  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cessAmount?: number;

  roundOffAmount?: number;
  grandTotal?: number;

  notes?: string | null;
  termsAndConditions?: string | null;

  createdBy: string;
}


// ============================================================
// UPDATE QUOTATION
// ============================================================

export interface QuotationUpdatePayload
  extends Partial<Omit<QuotationCreatePayload, "businessId" | "createdBy">> {
  updatedBy?: string;
}


// ============================================================
// UPDATE STATUS
// ============================================================

export interface QuotationStatusPayload {
  status: QuotationStatus;
  remarks?: string;
}


// ============================================================
// CANCEL QUOTATION
// ============================================================

export interface QuotationCancelPayload {
  reason?: string;
}


// ============================================================
// SEND QUOTATION
// ============================================================

export interface QuotationSendPayload {
  email?: string;
  phone?: string;
  message?: string;
}


// ============================================================
// DUPLICATE QUOTATION
// ============================================================

export interface QuotationDuplicatePayload {
  quotationDate?: string;
  validUntil?: string;
  customerId?: string | null;
}


// ============================================================
// CONVERT QUOTATION TO INVOICE
// ============================================================

export interface QuotationConvertToInvoicePayload {
  invoiceDate?: string;
  dueDate?: string;
  notes?: string;
}