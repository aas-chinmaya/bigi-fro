
// ==========================================================
// MONEY RECEIPT TYPES
// ==========================================================

export type MoneyReceiptType =
  | "INVOICE_PAYMENT"
  | "CUSTOMER_ADVANCE"
  | "OTHER_RECEIPT";

// ==========================================================
// PAYMENT METHOD
// ==========================================================

export type MoneyReceiptPaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "UPI"
  | "CHEQUE"
  | "CARD"
  | "OTHER";

// ==========================================================
// STATUS
// ==========================================================

export type MoneyReceiptStatus =
  | "DRAFT"
  | "POSTED";

// ==========================================================
// MONEY RECEIPT
// ==========================================================

export interface MoneyReceipt {
  id: string;

  receiptNo: string;
  receiptDate: string;

  customerId?: string;
  customerName?: string;

  receiptType: MoneyReceiptType;

  amount: number;

  paymentMethod: MoneyReceiptPaymentMethod;

  referenceNo?: string;
  remarks?: string;

  status: MoneyReceiptStatus;

  createdAt: string;
  updatedAt: string;
}

// ==========================================================
// CREATE MONEY RECEIPT
// ==========================================================

export interface CreateMoneyReceiptPayload {
  receiptDate: string;

  customerId?: string;
  customerName?: string;

  receiptType: MoneyReceiptType;

  amount: number;

  paymentMethod: MoneyReceiptPaymentMethod;

  referenceNo?: string;
  remarks?: string;
}

// ==========================================================
// UPDATE MONEY RECEIPT
// ==========================================================

export type UpdateMoneyReceiptPayload =
  Partial<CreateMoneyReceiptPayload>;

// ==========================================================
// QUERY PARAMS
// ==========================================================

export interface MoneyReceiptQueryParams {
  page?: number;
  limit?: number;
  search?: string;

  customerId?: string;

  receiptType?: MoneyReceiptType;

  paymentMethod?: MoneyReceiptPaymentMethod;

  status?: MoneyReceiptStatus;

  fromDate?: string;
  toDate?: string;
}

// ==========================================================
// LIST RESPONSE
// ==========================================================

export interface MoneyReceiptListResponse {
  data: MoneyReceipt[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
