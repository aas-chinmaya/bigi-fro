
// ==========================================================
// PAYMENT RECEIPT CORE ENUMS
// ==========================================================

export type ReceiptVoucherStatus =
  | "DRAFT"
  | "RECEIVED";

export type ReceiptSource =
  | "MANUAL"
  | "ONLINE"
  | "OTHER"
  | "POS";

export type PaymentReceiptStatus = ReceiptVoucherStatus;

export type PaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "NET_BANKING";

// ==========================================================
// PAYMENT RECEIPT MODEL
// ==========================================================

export interface PaymentReceipt {
  id: string;
  businessId?: string | null;
  branchId?: string | null;

  receiptNumber?: string | null;
  receiptDate: string;
  financialYear: string;

  receiptStatus: ReceiptVoucherStatus;
  receiptSource: ReceiptSource;

  customerId: string;
  customerName: string;
  customerPhone?: string | null;
  customerGSTIN?: string | null;

  paymentId?: string | null;
  paymentMethod: PaymentMethod;
  documentNumber: string;
  amount: number;

  remarks?: string | null;
  notes?: string | null;

  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ==========================================================
// PAYMENT RECEIPT FORM VALUES
// ==========================================================

export interface PaymentReceiptFormValues {
  businessId?: string;
  branchId?: string;

  receiptNumber?: string;
  receiptDate: string;
  financialYear?: string;

  receiptStatus: ReceiptVoucherStatus;
  receiptSource: ReceiptSource;

  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerGSTIN?: string;

  paymentId?: string;
  paymentMethod: PaymentMethod;
  documentNumber: string;
  amount: number;

  remarks?: string;
  notes?: string;

  createdBy?: string;
  updatedBy?: string;
}

export const PAYMENT_RECEIPT_FORM_DEFAULTS: PaymentReceiptFormValues = {
  businessId: "",
  branchId: "",
  receiptNumber: "",
  receiptDate: new Date().toISOString().slice(0, 10),
  financialYear: "",
  receiptStatus: "RECEIVED",
  receiptSource: "POS",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerGSTIN: "",
  paymentId: "",
  paymentMethod: "CASH",
  documentNumber: "",
  amount: 0,
  remarks: "",
  notes: "",
  createdBy: "system",
  updatedBy: "",
};

// ==========================================================
// CREATE PAYMENT RECEIPT
// ==========================================================

export interface CreatePaymentReceiptPayload {
  businessId?: string;
  branchId?: string;

  receiptNumber?: string;
  receiptDate: string;
  financialYear?: string;

  receiptStatus?: ReceiptVoucherStatus;
  receiptSource?: ReceiptSource;

  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerGSTIN?: string;

  paymentId?: string;
  paymentMethod: PaymentMethod;
  documentNumber: string;
  amount: number;

  remarks?: string;
  notes?: string;

  createdBy?: string;
  updatedBy?: string;
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
