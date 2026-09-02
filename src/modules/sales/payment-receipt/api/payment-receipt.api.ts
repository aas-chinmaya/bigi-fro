
import api from "@/services/api";

import type {
  PaymentReceipt,
  PaymentReceiptListResponse,
  PaymentReceiptQueryParams,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,
} from "../types/payment-receipt.types";

export const paymentReceiptApi = {
  getPaymentReceipts: async (
    params?: PaymentReceiptQueryParams,
  ): Promise<PaymentReceiptListResponse> => {
    const response = await api.get<PaymentReceiptListResponse>(
      "/payment-receipts",
      { params },
    );

    return response.data;


  },

  getPaymentReceiptById: async (
    id: string,
  ): Promise<PaymentReceipt> => {
    const response = await api.get<PaymentReceipt>(
      `/payment-receipts/${id}`,
    );
    return response.data;


  },

  createPaymentReceipt: async (
    payload: CreatePaymentReceiptPayload,
  ): Promise<PaymentReceipt> => {
    const response = await api.post<PaymentReceipt>(
      "/payment-receipts",
      payload,
    );

    return response.data;
  },

  updatePaymentReceipt: async (
    id: string,
    payload: UpdatePaymentReceiptPayload,
  ): Promise<PaymentReceipt> => {
    const response = await api.patch<PaymentReceipt>(
      `/payment-receipts/${id}`,
      payload,
    );

    return response.data;
  },
};

