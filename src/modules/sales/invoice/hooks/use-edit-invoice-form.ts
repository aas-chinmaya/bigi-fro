"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { InvoiceFormValues } from "../types/invoice-form.types";
import { invoiceSchema } from "../schemas/invoice.schema";

import { DEFAULT_VALUES } from "./use-invoice-form";
import { useBusiness } from "./use-business";
import { useInvoiceQuery } from "./use-invoice-query";
import { mapDraftToFormValues } from "../lib/edit-invoice-mapping";

export function useEditInvoiceForm(invoiceId: string) {
  const { business } = useBusiness();

  const { selectedDraft, loading, getDraftById } = useInvoiceQuery();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // --------------------------------------------------------
  // Fetch the draft once per invoiceId
  // --------------------------------------------------------

  const fetchedInvoiceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!invoiceId) return;
    if (fetchedInvoiceRef.current === invoiceId) return;

    fetchedInvoiceRef.current = invoiceId;
    void getDraftById(invoiceId);
    // getDraftById may have an unstable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  // --------------------------------------------------------
  // Draft (API) -> form values
  // --------------------------------------------------------

  const initialValues = useMemo<InvoiceFormValues | null>(
    () => mapDraftToFormValues(selectedDraft as Record<string, unknown>, business),
    [selectedDraft, business],
  );

  // --------------------------------------------------------
  // Push initial values into the form once per draft
  // --------------------------------------------------------

  const initializedInvoiceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedDraft || !initialValues) return;

    const draftId = String(
      (selectedDraft as Record<string, unknown>).id ?? invoiceId,
    );

    if (initializedInvoiceRef.current === draftId) return;
    initializedInvoiceRef.current = draftId;

    form.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDraft, initialValues]);

  // --------------------------------------------------------
  // Discard changes -> reload the original draft values
  // --------------------------------------------------------

  const resetToInitial = useCallback(() => {
    if (!initialValues) return;
    form.reset(initialValues);
  }, [initialValues, form]);

  // --------------------------------------------------------
  // Status flags
  // --------------------------------------------------------

  const invoiceStatus = String(
    (selectedDraft as Record<string, unknown> | undefined)?.invoiceStatus ??
      "DRAFT",
  ).toUpperCase();

  const isFinalized = invoiceStatus !== "DRAFT";
  const isLoading = loading && !selectedDraft;
  const notFound = !loading && !selectedDraft;

  return {
    form,
    business,
    selectedDraft,
    initialValues,
    resetToInitial,
    isLoading,
    notFound,
    isFinalized,
  };
}
