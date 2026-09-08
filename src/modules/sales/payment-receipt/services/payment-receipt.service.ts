
import { paymentReceiptApi } from "../api/payment-receipt.api";

import type {
  PaymentReceiptQueryParams,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,PaymentAdjustmentPayload
} from "../types/payment-receipt.types";

export const paymentReceiptService = {
  getPaymentReceipts: (
    params?: PaymentReceiptQueryParams,
  ) => {
    return paymentReceiptApi.getPaymentReceipts(params);
  },

getPaymentReceiptById: (id: string, businessId?: string) => {
  return paymentReceiptApi.getPaymentReceiptById(id, businessId);
},

  createPaymentReceipt: (
    payload: CreatePaymentReceiptPayload,
  ) => {
    return paymentReceiptApi.createPaymentReceipt(payload);
  },

  updatePaymentReceipt: (
    id: string,
    payload: UpdatePaymentReceiptPayload,
  ) => {
    return paymentReceiptApi.updatePaymentReceipt(
      id,
      payload,
    );
  },


   // ==========================================================
  // PAYMENT ADJUSTMENT
  // ==========================================================

  createPaymentAdjustment: (
    payload: PaymentAdjustmentPayload,
  ) => {
    return paymentReceiptApi.createPaymentAdjustment(
      payload,
    );
  },

  getPaymentAdjustmentById: (
    id: string,
    businessId?: string,
  ) => {
    return paymentReceiptApi.getPaymentAdjustmentById(
      id,
      businessId,
    );
  },
};
