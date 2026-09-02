import api from "@/services/api";
import type {
  DocumentTypePagination,
  VendorCategory,
  VendorCategoryListResponse,
  VendorCategoryPayload,
} from "../types";

const endpoints = {
  create: "/vendor-categories/createvendorcategory",
  list: "/vendor-categories/getallvendorcategory",
  byId: (id: string) => `/vendor-categories/getvendorcategorybyid/${id}`,
  update: (id: string) => `/vendor-categories/updatevendorcategory/${id}`,
  delete: (id: string) => `/vendor-categories/deletevendorcategory/${id}`,
};

export const vendorCategoryApi = {
  async create(payload: VendorCategoryPayload) {
    const response = await api.post<VendorCategory>(endpoints.create, payload);
    return response.data;
  },

  async getAll(page = 1, limit = 10): Promise<VendorCategoryListResponse> {
    const response = await api.get<{
      data?: VendorCategory[];
      pagination?: DocumentTypePagination;
    }>(endpoints.list, { params: { page, limit } });

    return {
      items: response.data.data ?? [],
      pagination: response.data.pagination ?? { page, limit },
    };
  },

  async getById(id: string) {
    const response = await api.get<VendorCategory>(endpoints.byId(id));
    return response.data;
  },

  async update(id: string, payload: VendorCategoryPayload) {
    const response = await api.put<VendorCategory>(endpoints.update(id), payload);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(endpoints.delete(id));
  },
};