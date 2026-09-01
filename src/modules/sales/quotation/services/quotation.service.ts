import { quotationApi } from "../api/quotation.api";

import type {
  QuotationCreatePayload,
  QuotationListParams,
  QuotationUpdatePayload,
} from "../types/quotation.types";

export const quotationService = {
  getQuotations(params?: QuotationListParams) {
    return quotationApi.getAll(params);
  },

  getQuotationById(id: string) {
    return quotationApi.getById(id);
  },

  createQuotation(payload: QuotationCreatePayload) {
    return quotationApi.create(payload);
  },

  updateQuotation(id: string, payload: QuotationUpdatePayload) {
    return quotationApi.update(id, payload);
  },

  deleteQuotation(id: string) {
    return quotationApi.remove(id);
  },
};