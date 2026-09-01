export type QuotationStatus =
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Expired"
  | "Cancelled";

export type QuotationType = "B2B" | "B2C";

export interface QuotationListItem {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  quotationType: QuotationType;
  status: QuotationStatus;
  currency: string;
  grandTotal: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  customerName?: string;
  quotationType: QuotationType;
  status: QuotationStatus;
  currency: string;
  subtotal: number;
  discount: number;
  taxTotal: number;
  grandTotal: number;
  notes?: string;
  termsAndConditions?: string;
  items: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface QuotationCreatePayload {
  quotationDate: string;
  validUntil: string;
  customerId: string;
  quotationType: QuotationType;
  currency: string;
  discount?: number;
  notes?: string;
  termsAndConditions?: string;
  items: unknown[];
}

export interface QuotationUpdatePayload
  extends Partial<QuotationCreatePayload> {
  status?: QuotationStatus;
}

export interface QuotationFilters {
  search?: string;
  status?: QuotationStatus;
  quotationType?: QuotationType;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface QuotationListParams
  extends QuotationFilters,
    PaginationParams {}

export interface PaginatedQuotationResponse {
  data: QuotationListItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface QuotationApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}