
// ==========================================================
// PAYMENT RECEIPT TYPES
// ==========================================================

export type PaymentReceiptType =
  | "INVOICE_PAYMENT"
  | "CUSTOMER_ADVANCE"
  | "OTHER_RECEIPT";

// ==========================================================
// PAYMENT METHOD
// ==========================================================

export type PaymentReceiptPaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "UPI"
  | "CHEQUE"
  | "CARD"
  | "OTHER";

// ==========================================================
// STATUS
// ==========================================================

export type PaymentReceiptStatus =
  | "DRAFT"
  | "POSTED";

// ==========================================================
// PAYMENT RECEIPT
// ==========================================================

export interface PaymentReceipt {
  id: string;

  receiptNo: string;
  receiptDate: string;

  customerId?: string;
  customerName?: string;

  receiptType: PaymentReceiptType;

  amount: number;

  paymentMethod: PaymentReceiptPaymentMethod;

  referenceNo?: string;
  remarks?: string;

  status: PaymentReceiptStatus;

  createdAt: string;
  updatedAt: string;
}

// ==========================================================
// CREATE PAYMENT RECEIPT
// ==========================================================

export interface CreatePaymentReceiptPayload {
  receiptDate: string;

  customerId?: string;
  customerName?: string;

  receiptType: PaymentReceiptType;

  amount: number;

  paymentMethod: PaymentReceiptPaymentMethod;

  referenceNo?: string;
  remarks?: string;
}

// ==========================================================
// UPDATE PAYMENT RECEIPT
// ==========================================================

export type UpdatePaymentReceiptPayload =
  Partial<CreatePaymentReceiptPayload>;

// ==========================================================
// QUERY PARAMS
// ==========================================================

export interface PaymentReceiptQueryParams {
  page?: number;
  limit?: number;
  search?: string;

  customerId?: string;

  receiptType?: PaymentReceiptType;

  paymentMethod?: PaymentReceiptPaymentMethod;

  status?: PaymentReceiptStatus;

  fromDate?: string;
  toDate?: string;
}

// ==========================================================
// LIST RESPONSE
// ==========================================================

export interface PaymentReceiptListResponse {
  data: PaymentReceipt[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
