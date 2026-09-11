"use client";

import { useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/components/form/FormField";
import type { QuotationFormValues } from "../../schema/quotation.schema";

export function QuotationNotesCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  return (
    <Card className="space-y-4 p-5">
      <h3 className="text-sm font-semibold text-gray-900">Additional Information</h3>

      <FormField label="Notes" error={errors.notes?.message}>
        <Textarea
          {...register("notes")}
          rows={3}
          placeholder="Internal notes visible only to your team"
          maxLength={1000}
        />
      </FormField>

      <FormField label="Terms & Conditions" error={errors.termsAndConditions?.message}>
        <Textarea
          {...register("termsAndConditions")}
          rows={4}
          placeholder="Terms shown to the customer on the quotation"
          maxLength={2000}
        />
      </FormField>

      <FormField label="Remarks" error={errors.remarks?.message}>
        <Textarea
          {...register("remarks")}
          rows={2}
          placeholder="Optional remarks"
          maxLength={500}
        />
      </FormField>
    </Card>
  );
}
