import api from "@/services/api";

export const invoiceApi = {
  // ---------------------------------------------------------
  // Draft APIs
  // ---------------------------------------------------------

  createDraft(data: any) {
    return api.post("/sales-invoices/drafts", data);
  },

  getDrafts() {
    return api.get("/sales-invoices/fetch-drafts", { params: arguments[0] });
  },

  getDraftById(id: string) {
    return api.get(`/sales-invoices/fetch-drafts/${id}`);
  },

  updateDraft(id: string, data: any) {
    return api.patch(`/sales-invoices/drafts/${id}`, data);
  },

  deleteDraft(id: string) {
    return api.delete(`/sales-invoices/drafts/${id}`);
  },

  finalizeDraft(id: string, data?: any) {
    return api.post(`/sales-invoices/drafts/${id}/finalize`, data);
  },

  // ---------------------------------------------------------
  // Invoice APIs
  // ---------------------------------------------------------

  createInvoice(data: any) {
    return api.post("/sales-invoices/", data);
  },

  getInvoices(params?: Record<string, any>) {
    return api.get("/sales-invoices/invoices", { params });
  },

  getInvoiceById(id: string) {
    return api.get(`/sales-invoices/invoices/${id}`);
  },

  cancelInvoice(id: string) {
    return api.delete(`/sales-invoices/drafts/${id}`);
    // return api.patch(`/sales-invoices/invoices/${id}/cancel`);
  },

  deleteInvoice(id: string) {
    return api.delete(`/sales-invoices/invoices/${id}`);
  },
};
