
import { paymentReceiptApi } from "../api/payment-receipt.api";

import type {
  PaymentReceiptQueryParams,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,
} from "../types/payment-receipt.types";

export const paymentReceiptService = {
  getPaymentReceipts: (
    params?: PaymentReceiptQueryParams,
  ) => {
    return paymentReceiptApi.getPaymentReceipts(params);
  },

  getPaymentReceiptById: (id: string) => {
    return paymentReceiptApi.getPaymentReceiptById(id);
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
};
