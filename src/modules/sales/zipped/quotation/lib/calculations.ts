import type { DiscountType } from "../types/quotation.types";
import type { QuotationItemFormValues } from "../schema/quotation-item.schema";

// ============================================================
// CALCULATION ENGINE
//
// Pure functions only — no React, no side effects. Reused by the
// live form (for the running total preview), the view/print
// document, and the PDF generator, so all three can never drift
// out of sync with each other.
// ============================================================

/** Rounds to 2 decimal places while avoiding floating point noise. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface LineItemTotals {
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  amount: number;
}

export function calculateDiscountAmount(
  rate: number,
  quantity: number,
  discountType: DiscountType,
  discountValue: number,
): number {
  const base = rate * quantity;

  if (!discountValue) return 0;

  if (discountType === "PERCENTAGE") {
    return round2(base * (Math.min(discountValue, 100) / 100));
  }

  // FIXED discount cannot exceed the line's base amount.
  return round2(Math.min(discountValue, base));
}

export function calculateLineItem(item: {
  quantity: number;
  rate: number;
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
}): LineItemTotals {
  const quantity = Number(item.quantity) || 0;
  const rate = Number(item.rate) || 0;
  const taxRate = Number(item.taxRate) || 0;

  const grossAmount = round2(quantity * rate);

  const discountAmount = calculateDiscountAmount(
    rate,
    quantity,
    item.discountType,
    Number(item.discountValue) || 0,
  );

  const taxableAmount = round2(Math.max(grossAmount - discountAmount, 0));
  const taxAmount = round2(taxableAmount * (taxRate / 100));
  const amount = round2(taxableAmount + taxAmount);

  return {
    discountAmount,
    taxableAmount,
    taxAmount,
    amount,
  };
}

export interface QuotationTotals {
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  taxTotal: number;
  roundOff: number;
  grandTotal: number;
  totalItems: number;
  totalQuantity: number;
}

export function calculateQuotationTotals(
  items: QuotationItemFormValues[],
): QuotationTotals {
  let subtotal = 0;
  let discountTotal = 0;
  let taxableAmount = 0;
  let taxTotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const lineTotals = calculateLineItem(item);

    subtotal = round2(subtotal + quantity * rate);
    discountTotal = round2(discountTotal + lineTotals.discountAmount);
    taxableAmount = round2(taxableAmount + lineTotals.taxableAmount);
    taxTotal = round2(taxTotal + lineTotals.taxAmount);
    totalQuantity += quantity;
  }

  const preRoundTotal = round2(taxableAmount + taxTotal);
  const roundedTotal = Math.round(preRoundTotal);
  const roundOff = round2(roundedTotal - preRoundTotal);
  const grandTotal = round2(preRoundTotal + roundOff);

  return {
    subtotal,
    discountTotal,
    taxableAmount,
    taxTotal,
    roundOff,
    grandTotal,
    totalItems: items.length,
    totalQuantity,
  };
}
