
import api from "@/services/api";

import type {
  PaymentReceipt,
  PaymentReceiptListResponse,
  PaymentReceiptQueryParams,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,
PaymentReceiptResponse,
  PaymentAdjustmentPayload,
  PaymentAdjustment,
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
  businessId?: string,
): Promise<PaymentReceipt> => {
  const response = await api.get<PaymentReceiptResponse>(
    `/payment-receipts/${id}`,
    {
      params: businessId ? { businessId } : undefined,
    },
  );
  return response?.data?.data;
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
  // ==========================================================
  // PAYMENT ADJUSTMENT
  // ==========================================================

  createPaymentAdjustment: async (
    payload: PaymentAdjustmentPayload,
  ): Promise<PaymentAdjustment> => {
    const response = await api.post<PaymentAdjustment>(
      "/payment-adjustments/adjust",
      payload,
    );

    return response.data;
  },

  getPaymentAdjustmentById: async (
    id: string,
    businessId?: string,
  ): Promise<PaymentAdjustment> => {
    const response = await api.get<PaymentAdjustment>(
      `/payment-adjustments/${id}`,
      {
        params: businessId ? { businessId } : undefined,
      },
    );

    return response?.data;
  },
};








