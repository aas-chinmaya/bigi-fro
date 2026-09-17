"use client";

import { useEffect, useMemo } from "react";
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
  getSessionFormDefaults,
  sanitizeCreatePayload,
  sanitizeUpdatePayload,
  applyTotalsToValues,
  resolveTaxType,
} from "../../utils/quotation-form.utils";

import { useCurrentSession } from "@/modules/sales/shared/hooks/use-current-session";

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

  const { data: session } = useCurrentSession();
  const isSubmitting = isCreating || isUpdating;

  const sessionDefaults = useMemo(
    () => getSessionFormDefaults(session),
    [session],
  );

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationCreateSchema),
    defaultValues:
      mode === "edit" && quotation
        ? mapQuotationToFormValues(
            quotation,
            session?.business?.id,
            session?.user?.id,
          )
        : {
            ...getDefaultQuotationValues(
              session?.business?.id ?? "",
              session?.user?.id ?? "",
            ),
            ...sessionDefaults,
          },
    mode: "onBlur",
  });

  const { handleSubmit, reset, watch, setValue } = form;

  const businessStateCode = watch("businessStateCode");
  const placeOfSupplyCode = watch("placeOfSupplyCode");
  const items = watch("items");

  useEffect(() => {
    const taxType = resolveTaxType(businessStateCode, placeOfSupplyCode);
    setValue("taxType", taxType, { shouldDirty: false });
  }, [businessStateCode, placeOfSupplyCode, setValue]);

  useEffect(() => {
    const current = form.getValues();
    const withTotals = applyTotalsToValues(current);

    setValue("totalItems", withTotals.totalItems, { shouldDirty: false });
    setValue("totalQuantity", withTotals.totalQuantity, { shouldDirty: false });
    setValue("taxableAmount", withTotals.taxableAmount, { shouldDirty: false });
    setValue("discountAmount", withTotals.discountAmount, {
      shouldDirty: false,
    });
    setValue("cgstAmount", withTotals.cgstAmount, { shouldDirty: false });
    setValue("sgstAmount", withTotals.sgstAmount, { shouldDirty: false });
    setValue("igstAmount", withTotals.igstAmount, { shouldDirty: false });
    setValue("cessAmount", withTotals.cessAmount, { shouldDirty: false });
    setValue("roundOffAmount", withTotals.roundOffAmount, {
      shouldDirty: false,
    });
    setValue("grandTotal", withTotals.grandTotal, { shouldDirty: false });

    withTotals.items.forEach((line, i) => {
      setValue(`items.${i}.taxAmount`, line.taxAmount, { shouldDirty: false });
      setValue(`items.${i}.amount`, line.amount, { shouldDirty: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, businessStateCode, placeOfSupplyCode, setValue]);

  useEffect(() => {
    if (mode === "edit" && quotation) {
      reset(
        mapQuotationToFormValues(
          quotation,
          session?.business?.id,
          session?.user?.id,
        ),
      );
    }
  }, [mode, quotation, reset, session?.business?.id, session?.user?.id]);

  useEffect(() => {
    if (mode !== "create" || !session) return;

    reset({
      ...getDefaultQuotationValues(
        session.business?.id ?? "",
        session.user?.id ?? "",
      ),
      ...getSessionFormDefaults(session),
    });
  }, [mode, session, reset]);

  const onSubmit = async (values: QuotationFormValues) => {
    try {
      const currentUserId = session?.user?.id ?? values.createdBy ?? "";

      if (mode === "create") {
        const payload = sanitizeCreatePayload({
          ...values,
          businessId: values.businessId || session?.business?.id || "",
          createdBy: values.createdBy || currentUserId,
        });

        const res = await createQuotation(payload).unwrap();
        notify.success(res.message || "Quotation created successfully");
        onSuccess?.(res.data);
      } else if (mode === "edit" && quotation?.id) {
        const payload = sanitizeUpdatePayload(values, currentUserId);

        const res = await updateQuotation({
          id: quotation.id,
          data: payload,
        }).unwrap();

        notify.success(res.message || "Quotation updated successfully");
        onSuccess?.(res.data);
      }
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        (typeof err?.data === "string" ? err.data : null) ||
        err?.message ||
        "Something went wrong";

      notify.error(
        typeof apiMessage === "string"
          ? apiMessage
          : JSON.stringify(apiMessage),
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <QuotationDetailsSection />
        <QuotationPartiesSection />
        <QuotationItemsSection />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <QuotationPaymentSection />
          </div>
          <QuotationSummarySection />
        </div>

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