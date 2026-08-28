import { DEFAULT_VALUES } from "../hooks/use-invoice-form";

import type { InvoiceFormValues } from "../types/invoice-form.types";

import { text, numberValue, optionalText } from "./shared-helpers";

// ==========================================================
// API RESPONSE → FORM VALUES
// ==========================================================

export function toInvoiceFormValues(
  invoice: Record<string, unknown>,
): InvoiceFormValues {
  const values = {
    ...(DEFAULT_VALUES as InvoiceFormValues),
  };

  const destination =
    values as unknown as Record<
      string,
      unknown
    >;

  // ========================================================
  // NORMAL FIELDS
  // ========================================================

  for (const key of Object.keys(
    DEFAULT_VALUES,
  ) as Array<
    keyof InvoiceFormValues
  >) {
    if (key === "items") {
      continue;
    }

    const value =
      key === "grandTotal"
        ? invoice.grandTotal ??
          invoice.totalAmount
        : invoice[key];

    if (
      value !== null &&
      value !== undefined
    ) {
      destination[key] =
        value;
    }
  }

  // ========================================================
  // ITEMS
  // ========================================================

  const rawItems =
    Array.isArray(
      invoice.items,
    )
      ? invoice.items
      : [];

  values.items =
    rawItems.map(
      (
        raw,
      ) => {
        const item =
          raw as Record<
            string,
            unknown
          >;

        return {
        

          productId:
            text(
              item.productId ??
                item.itemId,
            ),

          productName:
            text(
              item.itemName ??
                item.product ??
                item.productName,
            ),

          itemCode:
            text(
              item.itemCode ??
                item.code ??
                item.productId ??
                item.itemId,
            ) || "NA",

          unit:
            text(item.unit) ||
            "NOS",

          hsnSacCode:
            text(
              item.hsnSacCode,
            ) || "NA",

          classification:
            String(
              item.classification ??
                "GOODS",
            ).toUpperCase() ===
            "SERVICES"
              ? "SERVICES"
              : "GOODS",

          quantity:
            numberValue(
              item.quantity,
            ),

          rate:
            numberValue(
              item.unitPrice ??
                item.sellingPrice ??
                item.rate,
            ),

          // ==================================================
          // GST RATE
          // ==================================================

          gstRate:
            numberValue(
              item.gstRate,
            ),

          discountType:
            String(
              item.discountType ??
                "percentage",
            ).toLowerCase() ===
            "fixed"
              ? "fixed"
              : "percentage",

          discountValue:
            numberValue(
              item.discountValue,
            ),

          taxableAmount:
            numberValue(
              item.taxableAmount,
            ),

          cgst:
            numberValue(
              item.cgstAmount ??
                item.cgst,
            ),

          sgst:
            numberValue(
              item.sgstAmount ??
                item.sgst,
            ),

          igst:
            numberValue(
              item.igstAmount ??
                item.igst,
            ),

          cess:
            numberValue(
              item.cessAmount ??
                item.cess,
            ),

          grandTotal:
            numberValue(
              item.lineTotal ??
                item.grandTotal ??
                item.totalAmount,
            ),

          description:
            text(
              item.description,
            ) || undefined,
        } satisfies InvoiceItemFormValues;
      },
    );

  return values;
}



