"use client";

import { FormProvider } from "react-hook-form";

import { useQuotationForm } from "../../hooks/use-quotation-form";
import { QuotationCustomerCard } from "./quotation-customer-card";
import { QuotationDetailsCard } from "./quotation-details-card";
import { QuotationFormActions } from "./quotation-form-actions";
import { QuotationItemsCard } from "./quotation-items-card";
import { QuotationNotesCard } from "./quotation-notes-card";
import { QuotationTotalsCard } from "./quotation-totals-card";
import type { QuotationFormValues } from "../../schema/quotation.schema";
import type { QuotationFormMode } from "../../types/quotation-form.types";

interface QuotationFormProps {
  mode: QuotationFormMode;
  quotationId?: string;
  defaultValues?: Partial<QuotationFormValues>;
  onSuccess: (id: string) => void;
}

/**
 * Single form implementation shared by Create and Edit. Only the
 * `mode`, `quotationId`, and `defaultValues` differ between the two
 * screens — every field, validation rule, and calculation lives here
 * exactly once.
 */
export function QuotationForm({
  mode,
  quotationId,
  defaultValues,
  onSuccess,
}: QuotationFormProps) {
  const {
    form,
    itemsArray,
    totals,
    addItem,
    removeItem,
    onSubmit,
    isSubmitting,
    isDirty,
    errors,
  } = useQuotationForm({ mode, quotationId, defaultValues, onSuccess });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <QuotationDetailsCard isEditingExisting={mode === "edit"} />
            <QuotationCustomerCard />
            <QuotationItemsCard
              itemsArray={itemsArray}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              rootError={errors.items?.message as string | undefined}
            />
            <QuotationNotesCard />
          </div>

          <div className="space-y-6">
            <QuotationTotalsCard totals={totals} />
          </div>
        </div>

        <QuotationFormActions
          mode={mode}
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          onSubmit={onSubmit}
        />
      </form>
    </FormProvider>
  );
}
