"use client";

import { Button } from "@/components/ui/button";
import type { QuotationFormMode } from "../../types/quotation-form.types";

interface QuotationFormActionsProps {
  mode: QuotationFormMode;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function QuotationFormActions({
  mode,
  isSubmitting,
  onCancel,
}: QuotationFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "create"
            ? "Creating..."
            : "Updating..."
          : mode === "create"
            ? "Create Quotation"
            : "Update Quotation"}
      </Button>
    </div>
  );
}