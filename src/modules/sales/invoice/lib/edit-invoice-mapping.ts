import type { InvoiceFormValues } from "../types/invoice-form.types";
import type { BusinessContext } from "../hooks/use-business";

import { getStateCode } from "./state-code";
import { toInvoiceFormValues } from "./invoice-form-values";

// ==========================================================
// mapDraftToFormValues
//
// Turns a fetched draft/invoice (API shape) into a fully
// populated InvoiceFormValues, ready to hand to form.reset().
//
// This is used both when a draft first loads AND when the
// user clicks "Discard changes" — previously this ~250 line
// object literal was duplicated three times across
// EditInvoiceWrapper.tsx (initial load effect, form-reset
// effect, and handleReset). It's consolidated here into one
// function so there's a single source of truth.
//
// NOTE: the original code resolved the billing/place-of-supply
// state codes slightly differently in each of the three spots
// (one used `||` chaining, the others used `??`, which meant an
// already-resolved empty string could short-circuit the
// fallback to business.sellerStateCode). This version always
// uses `||`, i.e. an empty string is treated as "not set" and
// falls through to the next option — this was clearly the
// intent, so it's fixed here rather than reproduced.
// ==========================================================

export function mapDraftToFormValues(
  draft: Record<string, unknown> | null | undefined,
  business: BusinessContext,
): InvoiceFormValues | null {
  if (!draft) return null;

  const values = toInvoiceFormValues(draft);

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

  return {
    ...values,

    // ------------------------------------------------------
    // Business / branch / user context
    // ------------------------------------------------------
    businessId: business.id || values.businessId,
    branchId: business.branchId || values.branchId,
    createdBy: business.createdBy || values.createdBy,

    // ------------------------------------------------------
    // Seller (always the current business, not the draft's
    // stored snapshot — matches original behaviour)
    // ------------------------------------------------------
    sellerLegalName: business.sellerLegalName,
    sellerTradeName: business.sellerTradeName,

    sellerGSTIN: business.sellerGSTIN,
    sellerPAN: business.sellerPAN,

    sellerPhone: business.sellerPhone,
    sellerEmail: business.sellerEmail,

    sellerAddressLine1: business.sellerAddressLine1,
    sellerAddressLine2: business.sellerAddressLine2,

    sellerCity: business.sellerCity,
    sellerState: business.sellerState,
    sellerStateCode: business.sellerStateCode,
    sellerPincode: business.sellerPincode,
    sellerCountry: business.sellerCountry,

    // ------------------------------------------------------
    // Shipping always mirrors billing while editing
    // ------------------------------------------------------
    sameAsBilling: true,

    shippingAddressLine1: values.billingAddressLine1 ?? "",
    shippingAddressLine2: values.billingAddressLine2 ?? "",
    shippingCity: values.billingCity ?? "",
    shippingState: values.billingState ?? "",
    shippingStateCode: billingStateCode,
    shippingPincode: values.billingPincode ?? "",
    shippingCountry: values.billingCountry ?? "India",

    // ------------------------------------------------------
    // Resolved state codes
    // ------------------------------------------------------
    billingStateCode,
    placeOfSupplyCode,
  };
}
