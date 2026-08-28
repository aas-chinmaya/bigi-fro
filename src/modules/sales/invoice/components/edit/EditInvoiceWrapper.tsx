



"use client";

import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { notify } from "@/lib/toast";
import { CheckCircle2, FilePenLine, Lock, RotateCcw } from "lucide-react";

import InvoiceFormLayout from "../shared/invoice-form-layout";
import InvoiceFormActions from "../shared/invoice-form-actions";

import { useEditInvoiceForm } from "../../hooks/use-edit-invoice-form";
import { useInvoiceActions } from "../../hooks/use-invoice-actions";
import { buildEditInvoicePayload } from "../../lib/build-invoice-payload";

import type { InvoiceFormValues } from "../../types/invoice-form.types";

interface EditInvoiceWrapperProps {
  invoiceId: string;
}
 
export default function EditInvoiceWrapper({
  invoiceId,
}: EditInvoiceWrapperProps) {
  const router = useRouter();

  const {
    form,
    business,
    resetToInitial,
    isLoading,
    notFound,
    isFinalized,
    error,
  } = useEditInvoiceForm(invoiceId);

  const { updateDraft, createInvoice } = useInvoiceActions();

  // --------------------------------------------------------
  // Update Draft
  // --------------------------------------------------------

  const handleUpdateDraft = async (values: InvoiceFormValues) => {
    if (!business.id || !business.branchId || !business.createdBy) {
      notify.error("Business, branch, or user information is missing.");
      return;
    }

    try {
      const payload = buildEditInvoicePayload(values, business);

      await updateDraft(invoiceId, payload as never).unwrap();

      notify.success("Draft updated successfully");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to update draft invoice:", error);
      notify.error("Failed to update draft invoice");
    }
  };

  // --------------------------------------------------------
  // Finalize
  //
  // IMPORTANT: uses the SAME createInvoice(payload) action as
  // CreateInvoiceWrapper — matches original behaviour.
  // --------------------------------------------------------

  const handleFinalize = async (values: InvoiceFormValues) => {
    if (!business.id || !business.branchId || !business.createdBy) {
      notify.error("Business, branch, or user information is missing.");
      return;
    }

    try {
      const payload = buildEditInvoicePayload(values, business);

      await createInvoice(payload).unwrap();

      notify.success("Invoice finalized successfully");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to finalize invoice:", error);
      notify.error("Failed to finalize invoice");
    }
  };

  // --------------------------------------------------------
  // Loading / not found
  // --------------------------------------------------------

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-400">Loading invoice...</div>
          </div>
        </div>
      </div>
    );
  }

  // Previously this branch was folded into the loading check
  // above (`isLoading || notFound`), so a failed fetch — wrong
  // id, 404, network error — showed "Loading invoice..."
  // forever instead of telling the user anything.
  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 text-center">
            <div className="text-sm font-medium text-gray-700">
              Invoice not found
            </div>
            <div className="text-sm text-gray-400">
              {error ??
                "We couldn't load this invoice. It may have been deleted, or the link may be incorrect."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Finalized invoices are read-only
  // --------------------------------------------------------

  if (isFinalized) {
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">This invoice is finalized.</p>
            <p className="mt-1">Finalized invoices are read-only.</p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFinalize)}
        className="mx-auto w-full max-w-[1600px] space-y-4"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <InvoiceFormLayout />

          <InvoiceFormActions
            resetLabel="Discard changes"
            resetIcon={RotateCcw}
            onReset={resetToInitial}
            secondaryLabel="Update Draft"
            secondaryIcon={FilePenLine}
            onSecondary={() => void form.handleSubmit(handleUpdateDraft)()}
            submitLabel="Finalize invoice"
            submitIcon={CheckCircle2}
          />
        </div>
      </form>
    </FormProvider>
  );
}