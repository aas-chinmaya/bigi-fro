"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { QuotationFormMode } from "../../types/quotation-form.types";

interface QuotationFormActionsProps {
  mode: QuotationFormMode;
  isSubmitting: boolean;
  isDirty: boolean;
  onSubmit: () => void;
}

export function QuotationFormActions({
  mode,
  isSubmitting,
  isDirty,
  onSubmit,
}: QuotationFormActionsProps) {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur">
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={() => router.back()}
      >
        Cancel
      </Button>

      <Button type="button" disabled={isSubmitting || !isDirty} onClick={onSubmit}>
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Spinner /> Saving...
          </span>
        ) : mode === "create" ? (
          "Create Quotation"
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}
