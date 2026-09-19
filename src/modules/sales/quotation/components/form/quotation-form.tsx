"use client";

import { useEffect, useMemo } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
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

import { QuotationCustomerFields } from "./quotation-customer-fields";
import { QuotationIssuerFields } from "./quotation-issuer-fields";
import { QuotationItemsSection } from "./quotation-items-section";
import { QuotationFooterSection } from "./quotation-footer-section";
import { QuotationFormActions } from "./quotation-form-actions";

export function QuotationForm({
  mode,
  quotation,
  onSuccess,
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
    mode: "onChange",
  });

  const { handleSubmit, reset, setValue, control } = form;

  const businessStateCode = useWatch({ control, name: "businessStateCode" });
  const placeOfSupplyCode = useWatch({ control, name: "placeOfSupplyCode" });
  const items = useWatch({ control, name: "items" });

  // Deep snapshot so nested qty/price/discount always trigger
  const itemsKey = useMemo(() => JSON.stringify(items ?? []), [items]);

  useEffect(() => {
    const taxType = resolveTaxType(businessStateCode, placeOfSupplyCode);
    setValue("taxType", taxType, { shouldDirty: false });
  }, [businessStateCode, placeOfSupplyCode, setValue]);

  // Instant totals — any line change / tax type change
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
      setValue(`items.${i}.total`, line.total, { shouldDirty: false });
      setValue(`items.${i}.cgstRate`, line.cgstRate, { shouldDirty: false });
      setValue(`items.${i}.cgstAmount`, line.cgstAmount, {
        shouldDirty: false,
      });
      setValue(`items.${i}.sgstRate`, line.sgstRate, { shouldDirty: false });
      setValue(`items.${i}.sgstAmount`, line.sgstAmount, {
        shouldDirty: false,
      });
      setValue(`items.${i}.igstRate`, line.igstRate, { shouldDirty: false });
      setValue(`items.${i}.igstAmount`, line.igstAmount, {
        shouldDirty: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey, businessStateCode, placeOfSupplyCode, setValue]);

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
    const current = form.getValues();
    if (!current.businessName && session.business?.name) {
      reset({
        ...getDefaultQuotationValues(
          session.business?.id ?? "",
          session.user?.id ?? "",
        ),
        ...getSessionFormDefaults(session),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, session?.business?.id, session?.user?.id]);

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
        notify.success(res.message || "Quotation created");
        onSuccess?.(res.data);
      } else if (mode === "edit" && quotation?.id) {
        const payload = sanitizeUpdatePayload(values, currentUserId);
        const res = await updateQuotation({
          id: quotation.id,
          data: payload,
        }).unwrap();
        notify.success(res.message || "Quotation updated");
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 pb-10"
        noValidate
      >
        {/* Same row: Customer | Issuer */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              Customer information
            </h2>
            <QuotationCustomerFields />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              Issuer details
            </h2>
            <QuotationIssuerFields />
          </section>
        </div>

        {/* Items + payment + notes + summary + signature */}
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <QuotationItemsSection />
          <div className="border-t border-slate-100 pt-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              Payment & notes
            </h2>
            <QuotationFooterSection />
          </div>
        </section>

        <QuotationFormActions mode={mode} isSubmitting={isSubmitting} />
      </form>
    </FormProvider>
  );
}

export default QuotationForm;
