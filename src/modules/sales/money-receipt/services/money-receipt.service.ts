
import { moneyReceiptApi } from "../api/money-receipt.api";

import type {
  MoneyReceiptQueryParams,
  CreateMoneyReceiptPayload,
  UpdateMoneyReceiptPayload,
} from "../types/money-receipt.types";

export const moneyReceiptService = {
  getMoneyReceipts: (
    params?: MoneyReceiptQueryParams,
  ) => {
    return moneyReceiptApi.getMoneyReceipts(params);
  },

  getMoneyReceiptById: (id: string) => {
    return moneyReceiptApi.getMoneyReceiptById(id);
  },

  createMoneyReceipt: (
    payload: CreateMoneyReceiptPayload,
  ) => {
    return moneyReceiptApi.createMoneyReceipt(payload);
  },

  updateMoneyReceipt: (
    id: string,
    payload: UpdateMoneyReceiptPayload,
  ) => {
    return moneyReceiptApi.updateMoneyReceipt(
      id,
      payload,
    );
  },
};
