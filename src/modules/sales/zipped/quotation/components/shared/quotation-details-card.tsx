"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "@/components/form/FormField";
import {
  PAYMENT_TERMS_OPTIONS,
  QUOTATION_SOURCE_OPTIONS,
} from "../../types/quotation.types";
import type { QuotationFormValues } from "../../schema/quotation.schema";

interface QuotationDetailsCardProps {
  isEditingExisting?: boolean;
}

export function QuotationDetailsCard({ isEditingExisting }: QuotationDetailsCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  return (
    <Card className="space-y-4 p-5">
      <h3 className="text-sm font-semibold text-gray-900">Quotation Details</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Quotation Number">
          <Input
            {...register("quotationNumber")}
            placeholder="Auto-generated"
            disabled={isEditingExisting}
          />
        </FormField>

        <FormField label="Quotation Date" required error={errors.quotationDate?.message}>
          <DateInput {...register("quotationDate")} />
        </FormField>

        <FormField label="Valid Until" error={errors.validUntil?.message}>
          <DateInput {...register("validUntil")} />
        </FormField>

        <FormField label="Source">
          <Controller
            control={control}
            name="source"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {QUOTATION_SOURCE_OPTIONS.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source.charAt(0) + source.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Payment Terms">
          <Controller
            control={control}
            name="paymentTerms"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS_OPTIONS.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>
    </Card>
  );
}
