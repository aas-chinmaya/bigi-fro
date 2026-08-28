import type { InvoiceFormValues } from "../types/invoice-form.types";
import type { BusinessContext } from "../hooks/use-business";

import { getStateCode } from "./state-code";
import { toInvoicePayload } from "./invoice-payload";

// ==========================================================
// SHARED: business context + invoice date + state codes
// ==========================================================

function applyCommonOverrides(
  payload: Record<string, unknown>,
  values: InvoiceFormValues,
  business: BusinessContext,
): {
  payload: Record<string, unknown>;
  billingStateCode: string;
  placeOfSupplyCode: string;
} {
  payload.businessId = business.id;
  payload.branchId = business.branchId;
  payload.createdBy = business.createdBy;

  // --------------------------------------------------------
  // Invoice date -> ISO, or omitted if invalid/empty
  // --------------------------------------------------------

  if (values.invoiceDate?.trim()) {
    const date = new Date(values.invoiceDate);
    payload.invoiceDate = Number.isNaN(date.getTime())
      ? undefined
      : date.toISOString();
  } else {
    payload.invoiceDate = undefined;
  }

  // --------------------------------------------------------
  // State codes
  // --------------------------------------------------------

  const billingStateCode =
    String(values.billingStateCode ?? "").trim() ||
    String(values.placeOfSupplyCode ?? "").trim() ||
    getStateCode(values.billingState) ||
    getStateCode(values.placeOfSupply) ||
    String(business.sellerStateCode ?? "").trim();

  const placeOfSupplyCode =
    String(values.placeOfSupplyCode ?? "").trim() ||
    getStateCode(values.placeOfSupply) ||
    billingStateCode;

  payload.billingStateCode = billingStateCode || undefined;
  payload.placeOfSupplyCode = placeOfSupplyCode || undefined;

  return { payload, billingStateCode, placeOfSupplyCode };
}

// ==========================================================
// CREATE
//
// Shipping only mirrors billing when the user checked
// "Same as billing".
// ==========================================================

export function buildCreateInvoicePayload(
  values: InvoiceFormValues,
  business: BusinessContext,
): Record<string, unknown> {
  const payload = toInvoicePayload(values);

  const { billingStateCode } = applyCommonOverrides(
    payload,
    values,
    business,
  );

  if (values.sameAsBilling && billingStateCode) {
    payload.shippingStateCode = billingStateCode;
  }

  return payload;
}

// ==========================================================
// EDIT
//
// Shipping always mirrors billing (an edited invoice always
// ships to the billing address, same as original behaviour).
// ==========================================================

export function buildEditInvoicePayload(
  values: InvoiceFormValues,
  business: BusinessContext,
): Record<string, unknown> {
  const payload = toInvoicePayload(values);

  const { billingStateCode } = applyCommonOverrides(
    payload,
    values,
    business,
  );

  payload.sameAsBilling = true;
  payload.shippingAddressLine1 = values.billingAddressLine1;
  payload.shippingAddressLine2 = values.billingAddressLine2;
  payload.shippingCity = values.billingCity;
  payload.shippingState = values.billingState;
  payload.shippingStateCode = billingStateCode || undefined;
  payload.shippingPincode = values.billingPincode;
  payload.shippingCountry = values.billingCountry;

  return payload;
}
