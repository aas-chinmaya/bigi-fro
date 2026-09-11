"use client";

import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { notify } from "@/lib/toast";
import {
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
} from "../api/quotation.api";
import { calculateQuotationTotals } from "../lib/calculations";
import { defaultQuotationFormValues, quotationSchema } from "../schema/quotation.schema";
import { emptyQuotationItem } from "../schema/quotation-item.schema";
import type { QuotationFormValues } from "../schema/quotation.schema";
import type { QuotationCreatePayload, QuotationUpdatePayload } from "../types/quotation.types";
import type { QuotationFormMode } from "../types/quotation-form.types";

interface UseQuotationFormOptions {
  mode: QuotationFormMode;
  quotationId?: string;
  defaultValues?: Partial<QuotationFormValues>;
  onSuccess?: (id: string) => void;
}

export function useQuotationForm({
  mode,
  quotationId,
  defaultValues,
  onSuccess,
}: UseQuotationFormOptions) {
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    mode: "onBlur",
    defaultValues: {
      ...defaultQuotationFormValues,
      ...defaultValues,
    },
  });

  const { control, handleSubmit, watch, formState } = form;

  const itemsArray = useFieldArray({ control, name: "items" });

  const watchedItems = watch("items");

  const totals = useMemo(
    () => calculateQuotationTotals(watchedItems || []),
    [watchedItems],
  );

  const [createQuotation, { isLoading: isCreating }] = useCreateQuotationMutation();
  const [updateQuotation, { isLoading: isUpdating }] = useUpdateQuotationMutation();

  const isSubmitting = isCreating || isUpdating;

  const addItem = useCallback(() => {
    itemsArray.append({ ...emptyQuotationItem });
  }, [itemsArray]);

  const removeItem = useCallback(
    (index: number) => {
      if (itemsArray.fields.length <= 1) {
        notify.error("A quotation needs at least one item");
        return;
      }
      itemsArray.remove(index);
    },
    [itemsArray],
  );

  const buildPayload = useCallback(
    (values: QuotationFormValues): QuotationCreatePayload | QuotationUpdatePayload => ({
      quotationDate: values.quotationDate,
      validUntil: values.validUntil || undefined,
      customerId: values.customerId,
      source: values.source,
      items: values.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        discountType: item.discountType,
        discountValue: item.discountValue,
        taxRate: item.taxRate,
      })),
      paymentTerms: values.paymentTerms,
      notes: values.notes,
      termsAndConditions: values.termsAndConditions,
      remarks: values.remarks,
    }),
    [],
  );

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        if (mode === "create") {
          const result = await createQuotation(
            buildPayload(values) as QuotationCreatePayload,
          ).unwrap();

          notify.success("Quotation created successfully");
          onSuccess?.(result.data.id);
        } else if (quotationId) {
          const result = await updateQuotation({
            id: quotationId,
            data: buildPayload(values) as QuotationUpdatePayload,
          }).unwrap();

          notify.success("Quotation updated successfully");
          onSuccess?.(result.data.id);
        }
      } catch (error: any) {
        const message =
          error?.data?.message || error?.message || "Something went wrong. Please try again.";
        notify.error(message);
      }
    },
    () => {
      notify.error("Please fix the highlighted fields before saving");
    },
  );

  return {
    form,
    itemsArray,
    totals,
    addItem,
    removeItem,
    onSubmit,
    isSubmitting,
    isDirty: formState.isDirty,
    errors: formState.errors,
  };
}
