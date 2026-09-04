import { invoiceApi } from "../api/invoice.api";

export const invoiceService = {
  // Drafts
  createDraft: (data: unknown) => invoiceApi.createDraft(data),

  getDrafts: () => invoiceApi.getDrafts(),
  getDrafts: (params?: Record<string, any>) => invoiceApi.getDrafts(params),

  getDraftById: (id: string) => invoiceApi.getDraftById(id),

  updateDraft: (id: string, data: unknown) =>
    invoiceApi.updateDraft(id, data),

  deleteDraft: (id: string) => invoiceApi.deleteDraft(id),

  finalizeDraft: (id: string, data?: unknown) =>
    invoiceApi.finalizeDraft(id, data),





  
  // Invoices
  createInvoice: (data: unknown) => invoiceApi.createInvoice(data),

  getInvoices: (params?: Record<string, any>) =>
    invoiceApi.getInvoices(params),

  getInvoiceById: (id: string) => invoiceApi.getInvoiceById(id),

  cancelInvoice: (id: string) => invoiceApi.cancelInvoice(id),

  deleteInvoice: (id: string) => invoiceApi.deleteInvoice(id),
};