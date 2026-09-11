// // ============================================================
// // QUOTATION ENUMS
// // ============================================================

// export type QuotationStatus =
//   | "DRAFT"
//   | "SENT"
//   | "ACCEPTED"
//   | "REJECTED"
//   | "EXPIRED"
//   | "CANCELLED";

// export type QuotationSource =
//   | "MANUAL"
//   | "ONLINE"
//   | "POS"
//   | "OTHER";

// export type PaymentTerms =
//   | "DUE_ON_RECEIPT"
//   | "NET_7"
//   | "NET_15"
//   | "NET_30"
//   | "NET_45"
//   | "NET_60";

// export type DiscountType =
//   | "PERCENTAGE"
//   | "FIXED";


// // ============================================================
// // CUSTOMER
// // ============================================================

// export interface QuotationCustomer {
//   id: string;
//   name: string;
//   phone?: string;
//   email?: string;
//   gstin?: string;
// }


// // ============================================================
// // QUOTATION ITEM
// // ============================================================

// export interface QuotationItem {
//   id?: string;

//   productId?: string;
//   productName?: string;
//   description?: string;

//   quantity: number;
//   unit?: string;

//   rate: number;

//   discount?: number;
//   discountType?: DiscountType;

//   taxRate?: number;
//   taxAmount?: number;

//   amount?: number;
// }


// // ============================================================
// // QUOTATION
// // ============================================================

// export interface Quotation {
//   id: string;

//   businessId?: string;
//   branchId?: string;

//   quotationNumber?: string;
//   quotationDate: string;
//   validUntil?: string;

//   financialYear?: string;

//   status: QuotationStatus;
//   source?: QuotationSource;

//   customerId: string;

//   customerName?: string;
//   customerPhone?: string;
//   customerEmail?: string;
//   customerGSTIN?: string;

//   customer?: QuotationCustomer;

//   items?: QuotationItem[];

//   subtotal?: number;
//   discount?: number;
//   taxableAmount?: number;
//   taxAmount?: number;
//   roundOff?: number;

//   totalAmount: number;

//   paymentTerms?: PaymentTerms;

//   notes?: string;
//   termsAndConditions?: string;
//   remarks?: string;

//   createdAt?: string;
//   updatedAt?: string;

//   createdBy?: string;
//   updatedBy?: string;
// }


// // ============================================================
// // LIST QUERY PARAMETERS
// // ============================================================

// export interface QuotationListParams {
//   page?: number;
//   limit?: number;

//   search?: string;

//   status?: QuotationStatus;
//   source?: QuotationSource;

//   customerId?: string;
//   branchId?: string;

//   financialYear?: string;

//   fromDate?: string;
//   toDate?: string;

//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }


// // ============================================================
// // PAGINATION
// // ============================================================

// export interface QuotationPagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }


// // ============================================================
// // API RESPONSES
// // ============================================================

// export interface QuotationListResponse {
//   success: boolean;
//   message: string;
//   data: Quotation[];
//   pagination?: QuotationPagination;
// }

// export interface QuotationResponse {
//   success: boolean;
//   message: string;
//   data: Quotation;
// }


// // ============================================================
// // CREATE QUOTATION
// // ============================================================

// export interface QuotationCreatePayload {
//   businessId?: string;
//   branchId?: string;

//   quotationDate: string;
//   validUntil?: string;

//   customerId: string;

//   source?: QuotationSource;

//   items: QuotationItem[];

//   paymentTerms?: PaymentTerms;

//   notes?: string;
//   termsAndConditions?: string;
//   remarks?: string;
// }


// // ============================================================
// // UPDATE QUOTATION
// // ============================================================

// export interface QuotationUpdatePayload {
//   quotationDate?: string;
//   validUntil?: string;

//   customerId?: string;

//   source?: QuotationSource;

//   items?: QuotationItem[];

//   paymentTerms?: PaymentTerms;

//   notes?: string;
//   termsAndConditions?: string;
//   remarks?: string;
// }


// // ============================================================
// // UPDATE STATUS
// // ============================================================

// export interface QuotationStatusPayload {
//   status: QuotationStatus;
//   remarks?: string;
// }


// // ============================================================
// // CANCEL QUOTATION
// // ============================================================

// export interface QuotationCancelPayload {
//   reason?: string;
// }


// // ============================================================
// // SEND QUOTATION
// // ============================================================

// export interface QuotationSendPayload {
//   email?: string;
//   phone?: string;
//   message?: string;
// }


// // ============================================================
// // DUPLICATE QUOTATION
// // ============================================================

// export interface QuotationDuplicatePayload {
//   quotationDate?: string;
//   validUntil?: string;
//   customerId?: string;
// }


// // ============================================================
// // CONVERT QUOTATION TO INVOICE
// // ============================================================

// export interface QuotationConvertToInvoicePayload {
//   invoiceDate?: string;
//   dueDate?: string;
//   notes?: string;
// }












// ============================================================
// modules/sales/quotation/types/quotation.types.ts
// ============================================================

export type QuotationStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled"
  | "converted";

export type DiscountType = "percentage" | "fixed";

// --------------------
// Item (supports CGST / SGST)
// --------------------

export interface QuotationItem {
  id?: string;
  productId?: string | null;
  name: string;
  description?: string;
  hsnSac?: string;
  quantity: number;
  unit?: string;
  rate: number;
  discountType?: DiscountType;
  discountValue?: number;
  gstRate?: number;           // e.g. 18
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  amount: number;             // taxable amount (qty * rate - discount)
  total: number;              // amount + tax
  imageUrl?: string;
  sortOrder?: number;
}

// --------------------
// Main Quotation (FLAT)
// --------------------

export interface Quotation {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil?: string | null;
  status: QuotationStatus;
  currency: string;
  poNumber?: string;
  referenceNumber?: string;
  notes?: string;
  internalNotes?: string;
  subtitle?: string;

  // ---------- FROM (Company) ----------
  fromName: string;
  fromEmail?: string;
  fromPhone?: string;
  fromGstin?: string;
  fromPan?: string;
  fromAddressLine1?: string;
  fromAddressLine2?: string;
  fromCity?: string;
  fromState?: string;
  fromCountry?: string;
  fromPincode?: string;
  fromLogoUrl?: string;

  // ---------- TO (Customer) ----------
  customerId?: string | null;
  toName: string;
  toEmail?: string;
  toPhone?: string;
  toGstin?: string;
  toPan?: string;
  toContactPerson?: string;
  toAddressLine1?: string;
  toAddressLine2?: string;
  toCity?: string;
  toState?: string;
  toCountry?: string;
  toPincode?: string;

  // ---------- Items ----------
  items: QuotationItem[];

  // ---------- Summary ----------
  subtotal: number;
  discountTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  otherCharges: number;
  roundOff: number;
  grandTotal: number;
  totalInWords?: string;

  // ---------- Payment ----------
  showBankDetails: boolean;
  bankAccountId?: string | null;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  accountHolderName?: string;

  showUpiDetails: boolean;
  upiId?: string;
  upiLinkedBank?: string;

  paymentTerms?: string;
  paymentInstructions?: string;

  // ---------- Signature ----------
  signatureType?: "simple" | "digital";
  signatureUrl?: string | null;
  signatureLabel?: string;
  authorizedPerson?: string;
  designation?: string;

  // ---------- Terms ----------
  terms: string[];                // simple list of terms

  // ---------- Meta ----------
  salesPersonId?: string | null;
  salesPersonName?: string;
  templateId?: string | null;

  // ---------- Linked ----------
  salesOrderId?: string | null;
  invoiceId?: string | null;

  // ---------- Audit ----------
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// --------------------
// API Wrappers
// --------------------

export interface QuotationResponse {
  success: boolean;
  message?: string;
  data: Quotation;
}

export interface QuotationListResponse {
  success: boolean;
  message?: string;
  data: Quotation[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QuotationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: QuotationStatus | QuotationStatus[];
  customerId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// --------------------
// Payloads
// --------------------

export interface QuotationCreatePayload {
  quotationDate: string;
  validUntil?: string | null;
  status?: QuotationStatus;
  currency?: string;
  poNumber?: string;
  referenceNumber?: string;
  notes?: string;
  internalNotes?: string;
  subtitle?: string;

  // From
  fromName: string;
  fromEmail?: string;
  fromPhone?: string;
  fromGstin?: string;
  fromPan?: string;
  fromAddressLine1?: string;
  fromAddressLine2?: string;
  fromCity?: string;
  fromState?: string;
  fromCountry?: string;
  fromPincode?: string;
  fromLogoUrl?: string;

  // To
  customerId?: string | null;
  toName: string;
  toEmail?: string;
  toPhone?: string;
  toGstin?: string;
  toPan?: string;
  toContactPerson?: string;
  toAddressLine1?: string;
  toAddressLine2?: string;
  toCity?: string;
  toState?: string;
  toCountry?: string;
  toPincode?: string;

  items: QuotationItem[];

  subtotal: number;
  discountTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  otherCharges: number;
  roundOff: number;
  grandTotal: number;
  totalInWords?: string;

  showBankDetails: boolean;
  bankAccountId?: string | null;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  accountHolderName?: string;

  showUpiDetails: boolean;
  upiId?: string;
  upiLinkedBank?: string;

  paymentTerms?: string;
  paymentInstructions?: string;

  signatureType?: "simple" | "digital";
  signatureUrl?: string | null;
  signatureLabel?: string;
  authorizedPerson?: string;
  designation?: string;

  terms: string[];
}

export type QuotationUpdatePayload = Partial<QuotationCreatePayload>;

export interface QuotationStatusPayload {
  status: QuotationStatus;
  notes?: string;
}

export interface QuotationCancelPayload {
  reason?: string;
  notes?: string;
}

export interface QuotationSendPayload {
  toEmails?: string[];
  ccEmails?: string[];
  subject?: string;
  message?: string;
  attachPdf?: boolean;
}

export interface QuotationDuplicatePayload {
  quotationDate?: string;
  validUntil?: string;
  keepCustomer?: boolean;
}

export interface QuotationConvertToInvoicePayload {
  invoiceDate?: string;
  dueDate?: string;
  notes?: string;
}