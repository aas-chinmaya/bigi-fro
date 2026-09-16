// ============================================================
// quotation-form.types.ts
// ============================================================

import type { Quotation } from "./quotation.types";
import type { QuotationCreateSchema } from "../schemas/quotation.schema";

export type QuotationFormMode = "create" | "edit";

export interface QuotationFormProps {
  mode: QuotationFormMode;
  quotation?: Quotation | null;
  onSuccess?: (quotation: Quotation) => void;
  onCancel?: () => void;
}

/** Form values = create schema (used for both create & edit) */
export type QuotationFormValues = QuotationCreateSchema;