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
  onCancel?: () => void;
}

export function QuotationFormActions({
  mode,
  isSubmitting,
}: QuotationFormActionsProps) {
  const { reset, formState } = useFormContext<QuotationFormValues>();

  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSubmitting || !formState.isDirty}
        onClick={() => reset()}
      >
        Reset
      </Button>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "create"
            ? "Saving…"
            : "Updating…"
          : mode === "create"
            ? "Create quotation"
            : "Update quotation"}
      </Button>
    </div>
  );
}
