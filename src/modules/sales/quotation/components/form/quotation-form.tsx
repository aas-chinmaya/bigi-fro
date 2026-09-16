"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notify } from "@/lib/toast";

import { quotationCreateSchema } from "../../schemas/quotation.schema";
import {
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
} from "../../api/quotation.api";

import type {
  QuotationFormProps,
  QuotationFormValues,
} from "../../types/quotation-form.types";
import {
  getDefaultQuotationValues,
  mapQuotationToFormValues,
} from "../../utils/quotation-form.utils";

import { QuotationDetailsSection } from "./quotation-details-section";
import { QuotationPartiesSection } from "./quotation-parties-section";
import { QuotationItemsSection } from "./quotation-items-section";
import { QuotationSummarySection } from "./quotation-summary-section";
import { QuotationAdditionalsSection } from "./quotation-additionals-section";
import { QuotationPaymentSection } from "./quotation-payment-section";
import { QuotationSignatureSection } from "./quotation-signature-section";
import { QuotationFormActions } from "./quotation-form-actions";

export function QuotationForm({
  mode,
  quotation,
  onSuccess,
  onCancel,
}: QuotationFormProps) {
  const [createQuotation, { isLoading: isCreating }] =
    useCreateQuotationMutation();
  const [updateQuotation, { isLoading: isUpdating }] =
    useUpdateQuotationMutation();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationCreateSchema),
    defaultValues:
      mode === "edit" && quotation
        ? mapQuotationToFormValues(quotation)
        : getDefaultQuotationValues(),
    mode: "onBlur",
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (mode === "edit" && quotation) {
      reset(mapQuotationToFormValues(quotation));
    }
  }, [mode, quotation, reset]);

  const onSubmit = async (values: QuotationFormValues) => {
    try {
      if (mode === "create") {
        const res = await createQuotation(values).unwrap();
        notify.success(res.message || "Quotation created successfully");
        onSuccess?.(res.data);
      } else if (mode === "edit" && quotation?.id) {
        const { createdBy, businessId, ...rest } = values;

        const res = await updateQuotation({
          id: quotation.id,
          data: {
            ...rest,
            updatedBy: createdBy || "current-user", // TODO: real user id
          },
        }).unwrap();

        notify.success(res.message || "Quotation updated successfully");
        onSuccess?.(res.data);
      }
    } catch (err: any) {
      notify.error(
        err?.data?.message || err?.message || "Something went wrong",
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <QuotationDetailsSection />
        <QuotationPartiesSection />
        <QuotationItemsSection />

        {/* Payment + Summary */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <QuotationPaymentSection />
          </div>
          <QuotationSummarySection />
        </div>

        {/* Terms + Signature */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <QuotationAdditionalsSection />
          </div>
          <QuotationSignatureSection />
        </div>

        <QuotationFormActions
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}

export default QuotationForm;
