import api from "@/services/api";

import type {
  CashReceipt,
  CashReceiptListResponse,
  CashReceiptQueryParams,
  CreateCashReceiptPayload,
  UpdateCashReceiptPayload,
} from "../types/cash-receipt.types";

export const cashReceiptApi = {
  getCashReceipts: async (
    params?: CashReceiptQueryParams,
  ) => {
    // const response =
    //   await api.get<CashReceiptListResponse>(
    //     "/cash-receipt",
    //     {
    //       params,
    //     },
    //   );

    // return response.data;

    return {
      data: [
        {
          id: "1",
          receiptNo: "CR-0001",
          receiptDate: "2026-08-25",
          customerId: "CUST-001",
          customerName: "ABC Traders",
          receiptType: "INVOICE_PAYMENT",
          amount: 5000,
          paymentMethod: "CASH",
          accountId: "ACC-001",
          accountName: "Cash",
          referenceNo: "REF-001",
          remarks: "Payment received",
          status: "POSTED",
          createdAt: "2026-08-25T10:00:00Z",
          updatedAt: "2026-08-25T10:00:00Z",
        },
        {
          id: "2",
          receiptNo: "CR-0002",
          receiptDate: "2026-08-24",
          customerId: "CUST-002",
          customerName: "XYZ Enterprises",
          receiptType: "CUSTOMER_ADVANCE",
          amount: 10000,
          paymentMethod: "UPI",
          accountId: "ACC-002",
          accountName: "Bank",
          referenceNo: "UPI-12345",
          remarks: "Advance payment",
          status: "DRAFT",
          createdAt: "2026-08-24T11:30:00Z",
          updatedAt: "2026-08-24T11:30:00Z",
        },
      ],

      pagination: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        total: 2,
        totalPages: 1,
      },
    };
  },

  getCashReceiptById: async (id: string) => {
    // const response = await api.get<CashReceipt>(
    //   `/cash-receipt/${id}`,
    // );

    // return response.data;

    return {
      id,
      receiptNo: "CR-0001",
      receiptDate: "2026-08-25",
      customerId: "CUST-001",
      customerName: "ABC Traders",
      receiptType: "INVOICE_PAYMENT",
      amount: 5000,
      paymentMethod: "CASH",
      accountId: "ACC-001",
      accountName: "Cash",
      referenceNo: "REF-001",
      remarks: "Payment received",
      status: "POSTED",
      createdAt: "2026-08-25T10:00:00Z",
      updatedAt: "2026-08-25T10:00:00Z",
    };
  },

  createCashReceipt: async (
    payload: CreateCashReceiptPayload,
  ) => {
    // const response = await api.post<CashReceipt>(
    //   "/cash-receipt",
    //   payload,
    // );

    // return response.data;

    return {
      id: "3",
      receiptNo: "CR-0003",
      ...payload,
      status: "DRAFT" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateCashReceipt: async (
    id: string,
    payload: UpdateCashReceiptPayload,
  ) => {
    // const response = await api.patch<CashReceipt>(
    //   `/cash-receipt/${id}`,
    //   payload,
    // );

    // return response.data;

    return {
      id,
      receiptNo: "CR-0001",
      receiptDate: "2026-08-25",
      customerId: "CUST-001",
      customerName: "ABC Traders",
      receiptType: "INVOICE_PAYMENT" as const,
      amount: 5000,
      paymentMethod: "CASH" as const,
      accountId: "ACC-001",
      accountName: "Cash",
      referenceNo: "REF-001",
      remarks: "Updated payment",
      status: "DRAFT" as const,
      createdAt: "2026-08-25T10:00:00Z",
      updatedAt: new Date().toISOString(),
      ...payload,
    };
  },
};