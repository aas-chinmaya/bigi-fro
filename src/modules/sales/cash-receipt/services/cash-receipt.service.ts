import { cashReceiptApi } from "../api/cash-receipt.api";

import type {
  CashReceiptQueryParams,
  CreateCashReceiptPayload,
  UpdateCashReceiptPayload,
} from "../types/cash-receipt.types";

export const cashReceiptService = {
  getCashReceipts: (
    params?: CashReceiptQueryParams,
  ) => {
    return cashReceiptApi.getCashReceipts(params);
  },

  getCashReceiptById: (id: string) => {
    return cashReceiptApi.getCashReceiptById(id);
  },

  createCashReceipt: (
    payload: CreateCashReceiptPayload,
  ) => {
    return cashReceiptApi.createCashReceipt(payload);
  },

  updateCashReceipt: (
    id: string,
    payload: UpdateCashReceiptPayload,
  ) => {
    return cashReceiptApi.updateCashReceipt(
      id,
      payload,
    );
  },
};