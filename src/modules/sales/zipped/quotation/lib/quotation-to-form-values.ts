import { toDateInputValue } from "./format";
import type { Quotation } from "../types/quotation.types";
import type { QuotationFormValues } from "../schema/quotation.schema";

export function quotationToFormValues(quotation: Quotation): QuotationFormValues {
  return {
    quotationNumber: quotation.quotationNumber || "",
    quotationDate: toDateInputValue(quotation.quotationDate),
    validUntil: toDateInputValue(quotation.validUntil),
    source: quotation.source || "MANUAL",

    customerId: quotation.customerId || "",
    customerName: quotation.customerName || quotation.customer?.name || "",
    customerPhone: quotation.customerPhone || quotation.customer?.phone || "",
    customerEmail: quotation.customerEmail || quotation.customer?.email || "",
    customerGSTIN: quotation.customerGSTIN || quotation.customer?.gstin || "",

    items: (quotation.items || []).map((item) => ({
      id: item.id,
      productId: item.productId || "",
      productName: item.productName || "",
      description: item.description || "",
      unit: item.unit || "",
      quantity: item.quantity,
      rate: item.rate,
      discountType: item.discountType,
      discountValue: item.discountValue,
      taxRate: item.taxRate,
    })),

    paymentTerms: quotation.paymentTerms || "DUE_ON_RECEIPT",
    notes: quotation.notes || "",
    termsAndConditions: quotation.termsAndConditions || "",
    remarks: quotation.remarks || "",
  };
}
