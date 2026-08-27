

export type CashReceiptType =
  | "INVOICE_PAYMENT"
  | "CUSTOMER_ADVANCE"
  | "OTHER_RECEIPT";

export type CashReceiptPaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "UPI"
  | "CHEQUE"
  | "CARD"
  | "OTHER";

export type CashReceiptStatus = "DRAFT" | "POSTED";

export interface CashReceipt {
  id: string;
  receiptNo: string;
  receiptDate: string;

  customerId?: string;
  customerName?: string;

  receiptType: CashReceiptType;

  amount: number;

  paymentMethod: CashReceiptPaymentMethod;

  referenceNo?: string;
  remarks?: string;

  status: CashReceiptStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateCashReceiptPayload {
  receiptDate: string;

  customerId?: string;
  customerName?: string;

  receiptType: CashReceiptType;

  amount: number;

  paymentMethod: CashReceiptPaymentMethod;

  referenceNo?: string;
  remarks?: string;
}

export type UpdateCashReceiptPayload = Partial<CreateCashReceiptPayload>;

export interface CashReceiptQueryParams {
  page?: number;
  limit?: number;
  search?: string;

  customerId?: string;
  receiptType?: CashReceiptType;
  paymentMethod?: CashReceiptPaymentMethod;
  status?: CashReceiptStatus;

  fromDate?: string;
  toDate?: string;
}

export interface CashReceiptListResponse {
  data: CashReceipt[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}