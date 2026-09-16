// ============================================================
// quotation-form.utils.ts
// ============================================================

import type { Quotation } from "../types/quotation.types";
import type { QuotationFormValues } from "../types/quotation-form.types";

/** Empty form values for create mode */
export function getDefaultQuotationValues(): QuotationFormValues {
  return {
    businessId: "", // TODO: from auth
    branchId: null,
    quotationDate: new Date().toISOString().slice(0, 10),
    validUntil: "",
    financialYear: null,

    businessName: "",
    businessLegalName: null,
    businessGSTIN: null,
    businessPAN: null,
    businessPhone: null,
    businessEmail: null,
    businessAddressLine1: null,
    businessAddressLine2: null,
    businessCity: null,
    businessState: null,
    businessStateCode: null,
    businessPincode: null,
    businessCountry: "India",

    prospectName: "",
    prospectCompanyName: null,
    prospectGSTIN: null,
    prospectPAN: null,
    prospectPhone: null,
    prospectEmail: null,
    prospectAddressLine1: null,
    prospectAddressLine2: null,
    prospectCity: null,
    prospectState: null,
    prospectStateCode: null,
    prospectPincode: null,
    prospectCountry: "India",

    customerId: null,

    placeOfSupply: null,
    placeOfSupplyCode: null,
    taxType: "CGST_SGST",
    reverseCharge: false,
    isExport: false,
    isSEZ: false,
    currency: "INR",
    exchangeRate: null,

    items: [
      {
        itemId: null,
        itemName: "",
        description: null,
        quantity: 1,
        unit: "NOS",
        rate: 0,
        discount: 0,
        discountType: "PERCENTAGE",
        taxRate: 18,
        taxAmount: 0,
        amount: 0,
      },
    ],

    totalItems: 1,
    totalQuantity: 1,
    taxableAmount: 0,
    discountAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    cessAmount: 0,
    roundOffAmount: 0,
    grandTotal: 0,

    notes: null,
    termsAndConditions: null,
    createdBy: "", // TODO: from auth
  };
}

/** Map API Quotation → form values (edit mode) */
export function mapQuotationToFormValues(q: Quotation): QuotationFormValues {
  return {
    businessId: q.businessId,
    branchId: q.branchId ?? null,
    quotationDate: q.quotationDate?.slice(0, 10) ?? "",
    validUntil: q.validUntil?.slice(0, 10) ?? "",
    financialYear: q.financialYear ?? null,

    businessName: q.businessName,
    businessLegalName: q.businessLegalName ?? null,
    businessGSTIN: q.businessGSTIN ?? null,
    businessPAN: q.businessPAN ?? null,
    businessPhone: q.businessPhone ?? null,
    businessEmail: q.businessEmail ?? null,
    businessAddressLine1: q.businessAddressLine1 ?? null,
    businessAddressLine2: q.businessAddressLine2 ?? null,
    businessCity: q.businessCity ?? null,
    businessState: q.businessState ?? null,
    businessStateCode: q.businessStateCode ?? null,
    businessPincode: q.businessPincode ?? null,
    businessCountry: q.businessCountry ?? "India",

    prospectName: q.prospectName,
    prospectCompanyName: q.prospectCompanyName ?? null,
    prospectGSTIN: q.prospectGSTIN ?? null,
    prospectPAN: q.prospectPAN ?? null,
    prospectPhone: q.prospectPhone ?? null,
    prospectEmail: q.prospectEmail ?? null,
    prospectAddressLine1: q.prospectAddressLine1 ?? null,
    prospectAddressLine2: q.prospectAddressLine2 ?? null,
    prospectCity: q.prospectCity ?? null,
    prospectState: q.prospectState ?? null,
    prospectStateCode: q.prospectStateCode ?? null,
    prospectPincode: q.prospectPincode ?? null,
    prospectCountry: q.prospectCountry ?? "India",

    customerId: q.customerId ?? null,

    placeOfSupply: q.placeOfSupply ?? null,
    placeOfSupplyCode: q.placeOfSupplyCode ?? null,
    taxType: q.taxType ?? "CGST_SGST",
    reverseCharge: q.reverseCharge ?? false,
    isExport: q.isExport ?? false,
    isSEZ: q.isSEZ ?? false,
    currency: q.currency ?? "INR",
    exchangeRate: q.exchangeRate ?? null,

    items:
      q.items?.length > 0
        ? q.items.map((item) => ({
            id: item.id,
            itemId: item.itemId ?? null,
            itemName: item.itemName ?? "",
            description: item.description ?? null,
            quantity: item.quantity ?? 1,
            unit: item.unit ?? "NOS",
            rate: item.rate ?? 0,
            discount: item.discount ?? 0,
            discountType: item.discountType ?? "PERCENTAGE",
            taxRate: item.taxRate ?? 0,
            taxAmount: item.taxAmount ?? 0,
            amount: item.amount ?? 0,
          }))
        : getDefaultQuotationValues().items,

    totalItems: q.totalItems ?? 0,
    totalQuantity: q.totalQuantity ?? 0,
    taxableAmount: q.taxableAmount ?? 0,
    discountAmount: q.discountAmount ?? 0,
    cgstAmount: q.cgstAmount ?? 0,
    sgstAmount: q.sgstAmount ?? 0,
    igstAmount: q.igstAmount ?? 0,
    cessAmount: q.cessAmount ?? 0,
    roundOffAmount: q.roundOffAmount ?? 0,
    grandTotal: q.grandTotal ?? 0,

    notes: q.notes ?? null,
    termsAndConditions: q.termsAndConditions ?? null,
    createdBy: q.createdBy,
  };
}