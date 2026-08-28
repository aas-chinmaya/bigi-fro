import type {
  InvoiceStatus,
  InvoiceType,
  PaymentStatus,
} from "./invoice.types";

export interface InvoiceListItem {
  id: string;
  invoiceId: string;

  invoiceNumber: string;
  invoiceDate: string;

  customerId: string;
  customerName: string;

  // Buyer display fields (list/table cells fall back to these when
  // customerName isn't populated, e.g. for manually entered buyers).
  buyerName?: string;
  buyerCompanyName?: string;

  invoiceType: InvoiceType;

  totalAmount: number;

  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceListState {
  items: InvoiceListItem[];

  loading: boolean;
  error: string | null;
}