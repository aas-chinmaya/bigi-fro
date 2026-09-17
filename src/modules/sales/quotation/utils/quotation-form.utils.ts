import type {
  Quotation,
  QuotationCreatePayload,
  QuotationUpdatePayload,
  TaxType,
  DiscountType,
} from "../types/quotation.types";
import type { QuotationFormValues } from "../types/quotation-form.types";
import { getStateCode }  from "@/modules/sales/shared/utils/state-code";


function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function calcLine(item: {
  quantity: number;
  rate: number;
  discount?: number;
  discountType?: DiscountType;
  taxRate?: number;
}) {
  const qty = Number(item.quantity) || 0;
  const rate = Number(item.rate) || 0;
  const discountVal = Number(item.discount) || 0;
  const discountType = item.discountType ?? "PERCENTAGE";
  const taxRate = Number(item.taxRate) || 0;

  const gross = qty * rate;
  let discountAmount =
    discountType === "PERCENTAGE" ? (gross * discountVal) / 100 : discountVal;
  discountAmount = Math.min(discountAmount, gross);

  const taxable = gross - discountAmount;
  const taxAmount = (taxable * taxRate) / 100;
  const amount = taxable + taxAmount;

  return {
    discountAmount: round2(discountAmount),
    taxable: round2(taxable),
    taxAmount: round2(taxAmount),
    amount: round2(amount),
  };
}

export interface CalculatedTotals {
  items: Array<{ taxAmount: number; amount: number }>;
  totalItems: number;
  totalQuantity: number;
  taxableAmount: number;
  discountAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  roundOffAmount: number;
  grandTotal: number;
}

export function resolveTaxType(
  businessStateCode?: string | null,
  placeOfSupplyCode?: string | null,
): TaxType {
  const biz = (businessStateCode || "").trim();
  const pos = (placeOfSupplyCode || "").trim();
  if (!biz || !pos) return "INTRA_STATE";
  return biz === pos ? "INTRA_STATE" : "INTER_STATE";
}

export function calculateQuotationTotals(
  items: QuotationFormValues["items"],
  taxType: TaxType | null | undefined = "INTRA_STATE",
): CalculatedTotals {
  let totalQuantity = 0;
  let taxableAmount = 0;
  let discountAmount = 0;
  let totalTax = 0;

  const calculatedItems = (items || []).map((item) => {
    const line = calcLine(item);
    totalQuantity += Number(item.quantity) || 0;
    taxableAmount += line.taxable;
    discountAmount += line.discountAmount;
    totalTax += line.taxAmount;
    return { taxAmount: line.taxAmount, amount: line.amount };
  });

  taxableAmount = round2(taxableAmount);
  discountAmount = round2(discountAmount);
  totalTax = round2(totalTax);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (taxType === "INTER_STATE") {
    igstAmount = totalTax;
  } else {
    cgstAmount = round2(totalTax / 2);
    sgstAmount = round2(totalTax - cgstAmount);
  }

  const rawGrand = taxableAmount + totalTax;
  const grandTotal = Math.round(rawGrand);
  const roundOffAmount = round2(grandTotal - rawGrand);

  return {
    items: calculatedItems,
    totalItems: items?.length ?? 0,
    totalQuantity: round2(totalQuantity),
    taxableAmount,
    discountAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    cessAmount: 0,
    roundOffAmount,
    grandTotal,
  };
}

export function getDefaultQuotationValues(
  businessId = "",
  createdBy = "",
): QuotationFormValues {
  return {
    businessId,
    createdBy,
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
    taxType: "INTRA_STATE",
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
    signature: undefined,
  };
}

export function mapQuotationToFormValues(
  q: Quotation,
  fallbackBusinessId?: string,
  fallbackCreatedBy?: string,
): QuotationFormValues {
  return {
    businessId: q.businessId || fallbackBusinessId || "",
    createdBy: q.createdBy || fallbackCreatedBy || "",
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
    taxType: q.taxType ?? "INTRA_STATE",
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
    signature: undefined,
  };
}

export function getSessionFormDefaults(session: {
  user: { id: string } | null;
  business: {
    id: string;
    name: string;
    legalName?: string | null;
    gstin?: string | null;
    pan?: string | null;
    phone?: string | null;
    email?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    stateCode?: string | null;
    pincode?: string | null;
    country: string;
    branchId?: string | null;
  } | null;
} | null): Partial<QuotationFormValues> {
  if (!session) return {};

  const { business, user } = session;
  const stateCode =
    business?.stateCode || getStateCode(business?.state || undefined) || null;

  return {
    businessId: business?.id ?? "",
    createdBy: user?.id ?? "",
    branchId: business?.branchId ?? null,
    businessName: business?.name ?? "",
    businessLegalName: business?.legalName ?? null,
    businessGSTIN: business?.gstin ?? null,
    businessPAN: business?.pan ?? null,
    businessPhone: business?.phone ?? null,
    businessEmail: business?.email ?? null,
    businessAddressLine1: business?.addressLine1 ?? null,
    businessAddressLine2: business?.addressLine2 ?? null,
    businessCity: business?.city ?? null,
    businessState: business?.state ?? null,
    businessStateCode: stateCode,
    businessPincode: business?.pincode ?? null,
    businessCountry: business?.country ?? "India",
  };
}

export function applyTotalsToValues(
  values: QuotationFormValues,
): QuotationFormValues {
  const taxType =
    values.taxType ??
    resolveTaxType(values.businessStateCode, values.placeOfSupplyCode);

  const totals = calculateQuotationTotals(values.items, taxType);

  const items = values.items.map((item, i) => ({
    ...item,
    taxAmount: totals.items[i]?.taxAmount ?? 0,
    amount: totals.items[i]?.amount ?? 0,
  }));

  return {
    ...values,
    taxType,
    items,
    totalItems: totals.totalItems,
    totalQuantity: totals.totalQuantity,
    taxableAmount: totals.taxableAmount,
    discountAmount: totals.discountAmount,
    cgstAmount: totals.cgstAmount,
    sgstAmount: totals.sgstAmount,
    igstAmount: totals.igstAmount,
    cessAmount: totals.cessAmount,
    roundOffAmount: totals.roundOffAmount,
    grandTotal: totals.grandTotal,
  };
}

export function sanitizeCreatePayload(
  values: QuotationFormValues,
): QuotationCreatePayload {
  const withTotals = applyTotalsToValues(values);
  const { signature: _sig, ...rest } = withTotals;

  return {
    businessId: rest.businessId,
    createdBy: rest.createdBy,
    branchId: rest.branchId || null,
    quotationDate: rest.quotationDate,
    validUntil: rest.validUntil,
    financialYear: rest.financialYear || null,

    businessName: rest.businessName,
    businessLegalName: rest.businessLegalName || null,
    businessGSTIN: rest.businessGSTIN || null,
    businessPAN: rest.businessPAN || null,
    businessPhone: rest.businessPhone || null,
    businessEmail: rest.businessEmail || null,
    businessAddressLine1: rest.businessAddressLine1 || null,
    businessAddressLine2: rest.businessAddressLine2 || null,
    businessCity: rest.businessCity || null,
    businessState: rest.businessState || null,
    businessStateCode: rest.businessStateCode || null,
    businessPincode: rest.businessPincode || null,
    businessCountry: rest.businessCountry || "India",

    prospectName: rest.prospectName,
    prospectCompanyName: rest.prospectCompanyName || null,
    prospectGSTIN: rest.prospectGSTIN || null,
    prospectPAN: rest.prospectPAN || null,
    prospectPhone: rest.prospectPhone || null,
    prospectEmail: rest.prospectEmail || null,
    prospectAddressLine1: rest.prospectAddressLine1 || null,
    prospectAddressLine2: rest.prospectAddressLine2 || null,
    prospectCity: rest.prospectCity || null,
    prospectState: rest.prospectState || null,
    prospectStateCode: rest.prospectStateCode || null,
    prospectPincode: rest.prospectPincode || null,
    prospectCountry: rest.prospectCountry || "India",

    customerId: rest.customerId || null,
    placeOfSupply: rest.placeOfSupply || null,
    placeOfSupplyCode: rest.placeOfSupplyCode || null,
    taxType: rest.taxType || "INTRA_STATE",
    reverseCharge: rest.reverseCharge ?? false,
    isExport: rest.isExport ?? false,
    isSEZ: rest.isSEZ ?? false,
    currency: rest.currency || "INR",
    exchangeRate: rest.exchangeRate ?? null,

    items: rest.items.map((item) => ({
      id: item.id,
      itemId: item.itemId || null,
      itemName: item.itemName || "",
      description: item.description || null,
      quantity: Number(item.quantity) || 0,
      unit: item.unit || null,
      rate: Number(item.rate) || 0,
      discount: Number(item.discount) || 0,
      discountType: item.discountType || "PERCENTAGE",
      taxRate: Number(item.taxRate) || 0,
      taxAmount: Number(item.taxAmount) || 0,
      amount: Number(item.amount) || 0,
    })),

    totalItems: rest.totalItems,
    totalQuantity: rest.totalQuantity,
    taxableAmount: rest.taxableAmount,
    discountAmount: rest.discountAmount,
    cgstAmount: rest.cgstAmount,
    sgstAmount: rest.sgstAmount,
    igstAmount: rest.igstAmount,
    cessAmount: rest.cessAmount,
    roundOffAmount: rest.roundOffAmount,
    grandTotal: rest.grandTotal,

    notes: rest.notes || null,
    termsAndConditions: rest.termsAndConditions || null,
  };
}

export function sanitizeUpdatePayload(
  values: QuotationFormValues,
  updatedBy: string,
): QuotationUpdatePayload {
  const createPayload = sanitizeCreatePayload(values);
  const { businessId: _b, createdBy: _c, ...rest } = createPayload;
  return { ...rest, updatedBy };
}