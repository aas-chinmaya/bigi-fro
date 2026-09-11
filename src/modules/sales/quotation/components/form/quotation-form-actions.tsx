// ============================================================
// components/sales/quotation/form/quotation-form-actions.tsx
// ============================================================

"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  mode: "create" | "edit";
  isSubmitting: boolean;
  onCancel: () => void;
}

export function QuotationFormActions({ mode, isSubmitting, onCancel }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Create Quotation" : "Edit Quotation"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "create"
            ? "Fill in the details to create a new quotation"
            : "Update the quotation details"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Quotation" : "Update Quotation"}
        </Button>
      </div>
    </div>
  );
}