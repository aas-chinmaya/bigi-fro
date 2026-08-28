
import api from "@/services/api";

import type {
  MoneyReceipt,
  MoneyReceiptListResponse,
  MoneyReceiptQueryParams,
  CreateMoneyReceiptPayload,
  UpdateMoneyReceiptPayload,
} from "../types/money-receipt.types";

export const moneyReceiptApi = {
  getMoneyReceipts: async (
    params?: MoneyReceiptQueryParams,
  ): Promise<MoneyReceiptListResponse> => {
    // const response = await api.get<MoneyReceiptListResponse>(
    //   "/money-receipt",
    //   { params },
    // );
    // return response.data;

    return {
      data: [
        {
          id: "1",
          receiptNo: "MR-0001",
          receiptDate: "2026-08-25",
          customerId: "CUST-001",
          customerName: "ABC Traders",
          receiptType: "INVOICE_PAYMENT",
          amount: 5000,
          paymentMethod: "CASH",
          referenceNo: "REF-001",
          remarks: "Payment received",
          status: "POSTED",
          createdAt: "2026-08-25T10:00:00Z",
          updatedAt: "2026-08-25T10:00:00Z",
        },
        {
          id: "2",
          receiptNo: "MR-0002",
          receiptDate: "2026-08-24",
          customerId: "CUST-002",
          customerName: "XYZ Enterprises",
          receiptType: "CUSTOMER_ADVANCE",
          amount: 10000,
          paymentMethod: "CASH",
          referenceNo: "REF-002",
          remarks: "Advance cash payment",
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

  getMoneyReceiptById: async (
    id: string,
  ): Promise<MoneyReceipt> => {
    // const response = await api.get<MoneyReceipt>(
    //   `/money-receipt/${id}`,
    // );
    // return response.data;

    return {
      id,
      receiptNo: "MR-0001",
      receiptDate: "2026-08-25",
      customerId: "CUST-001",
      customerName: "ABC Traders",
      receiptType: "INVOICE_PAYMENT",
      amount: 5000,
      paymentMethod: "CASH",
      referenceNo: "REF-001",
      remarks: "Payment received",
      status: "POSTED",
      createdAt: "2026-08-25T10:00:00Z",
      updatedAt: "2026-08-25T10:00:00Z",
    };
  },

  createMoneyReceipt: async (
    payload: CreateMoneyReceiptPayload,
  ): Promise<MoneyReceipt> => {
    const response = await api.post<MoneyReceipt>(
      "/money-receipt",
      payload,
    );

    return response.data;
  },

  updateMoneyReceipt: async (
    id: string,
    payload: UpdateMoneyReceiptPayload,
  ): Promise<MoneyReceipt> => {
    const response = await api.patch<MoneyReceipt>(
      `/money-receipt/${id}`,
      payload,
    );

    return response.data;
  },
};

