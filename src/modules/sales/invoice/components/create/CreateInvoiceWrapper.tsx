"use client";

import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { notify } from "@/lib/toast";
import { CheckCircle2, FilePenLine, RotateCcw } from "lucide-react";

import InvoiceFormLayout from "../shared/invoice-form-layout";
import InvoiceFormActions from "../shared/invoice-form-actions";

import { useCreateInvoiceForm } from "../../hooks/use-create-invoice-form";
import { useInvoiceActions } from "../../hooks/use-invoice-actions";
import { buildCreateInvoicePayload } from "../../lib/build-invoice-payload";

import type { InvoiceFormValues } from "../../types/invoice-form.types";
import type {
  CreateDraftPayload,
  CreateInvoicePayload,
} from "../../types/invoice-api.types";

// ==========================================================
// CREATE INVOICE WRAPPER
//
// Validation now lives entirely in schemas/invoice.schema.ts
// (Zod) via useCreateInvoiceForm's resolver. form.handleSubmit
// only calls the handlers below when the form is valid —
// react-hook-form sets field errors for us automatically, so
// there's no manual validateInvoice()/getRequiredFieldErrors()
// step left in this component.
// ==========================================================

export default function CreateInvoiceWrapper() {
  const router = useRouter();

  const { form, business, resetForm } = useCreateInvoiceForm();
  const { createDraft, createInvoice } = useInvoiceActions();

  // --------------------------------------------------------
  // Save Draft
  // --------------------------------------------------------

  const handleSaveDraft = async (values: InvoiceFormValues) => {
    try {
      const payload = buildCreateInvoicePayload(values, business);

      // buildCreateInvoicePayload returns a loosely-typed Record built by
      // the shared mapper; the required draft fields (invoiceType, items)
      // are always populated by the form/schema, so this cast is safe.
      await createDraft(payload as unknown as CreateDraftPayload).unwrap();

      notify.success("Draft saved successfully");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to create draft invoice:", error);
      notify.error("Failed to save draft invoice");
    }
  };

  // --------------------------------------------------------
  // Create Invoice
  // --------------------------------------------------------

  const handleCreateInvoice = async (values: InvoiceFormValues) => {
    try {
      const payload = buildCreateInvoicePayload(values, business);

      // Same rationale as handleSaveDraft — invoiceDate/customerId/items
      // are guaranteed by validation before this handler ever runs.
      await createInvoice(payload as unknown as CreateInvoicePayload).unwrap();

      notify.success("Invoice created successfully");
      router.push("/sales/invoice");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      notify.error("Failed to create invoice");
    }
  };

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateInvoice)}
        className="mx-auto w-full max-w-[1600px] space-y-4"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <InvoiceFormLayout />

          <InvoiceFormActions
            resetLabel="Reset form"
            resetIcon={RotateCcw}
            onReset={resetForm}
            secondaryLabel="Save Draft"
            secondaryIcon={FilePenLine}
            onSecondary={() => void form.handleSubmit(handleSaveDraft)()}
            submitLabel="Save invoice"
            submitIcon={CheckCircle2}
          />
        </div>
      </form>
    </FormProvider>
  );
}
