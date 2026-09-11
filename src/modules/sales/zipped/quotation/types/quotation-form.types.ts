import type { QuotationFormValues } from "../schema/quotation.schema";

/** Generic option shape used by every select/combobox in this module. */
export interface SelectOption {
  value: string;
  label: string;
}

/** Product option enriched with the fields needed to prefill a line item. */
export interface ProductOption extends SelectOption {
  itemCode?: string;
  unit?: string;
  rate?: number;
  taxRate?: number;
  hsnCode?: string;
}

/** Customer option enriched with the fields needed to prefill the buyer card. */
export interface CustomerOption extends SelectOption {
  phone?: string;
  email?: string;
  gstin?: string;
  billingAddress?: string;
}

export type QuotationFormMode = "create" | "edit";

export interface QuotationFormSubmitMeta {
  mode: QuotationFormMode;
  /** true when the user explicitly chose "Save as Draft" over "Save". */
  saveAsDraft?: boolean;
}

export type { QuotationFormValues };
