"use client";

import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type {
  QuotationFormMode,
  QuotationFormValues,
} from "../../types/quotation-form.types";

interface QuotationFormActionsProps {
  mode: QuotationFormMode;
  isSubmitting: boolean;
  /** Locked when already FINALIZED */
  readOnly?: boolean;
  onSubmitIntent: (status: "DRAFT" | "FINALIZED") => void;
}

export function QuotationFormActions({
  mode,
  isSubmitting,
  readOnly,
  onSubmitIntent,
}: QuotationFormActionsProps) {
  const { reset, formState } = useFormContext<QuotationFormValues>();

  if (readOnly) {
    return (
      <div className="flex items-center justify-end gap-2 pt-1">
        <p className="text-sm text-slate-500">
          This quotation is finalized and cannot be edited.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSubmitting || !formState.isDirty}
        onClick={() => reset()}
      >
        Reset
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSubmitting}
        onClick={() => onSubmitIntent("DRAFT")}
      >
        {isSubmitting
          ? "Saving…"
          : mode === "create"
            ? "Save as draft"
            : "Update draft"}
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={isSubmitting}
        onClick={() => onSubmitIntent("FINALIZED")}
      >
        {isSubmitting
          ? "Saving…"
          : mode === "create"
            ? "Finalize"
            : "Update & finalize"}
      </Button>
    </div>
  );
}
