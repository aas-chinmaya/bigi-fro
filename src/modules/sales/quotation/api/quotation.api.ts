import api from "@/services/api";

import type {
  QuotationCreatePayload,
  QuotationListParams,
  QuotationUpdatePayload,
} from "../types/quotation.types";

const QUOTATION_ENDPOINT = "/quotation";

export const quotationApi = {
  getAll: async (params?: QuotationListParams) => {
    const response = await api.get(QUOTATION_ENDPOINT, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`${QUOTATION_ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (payload: QuotationCreatePayload) => {
    const response = await api.post(QUOTATION_ENDPOINT, payload);
    return response.data;
  },

  update: async (id: string, payload: QuotationUpdatePayload) => {
    const response = await api.patch(
      `${QUOTATION_ENDPOINT}/${id}`,
      payload,
    );
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`${QUOTATION_ENDPOINT}/${id}`);
    return response.data;
  },
};


