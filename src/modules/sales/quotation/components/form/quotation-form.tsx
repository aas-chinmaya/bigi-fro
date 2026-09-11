// ============================================================
// components/sales/quotation/form/quotation-form.tsx
// MAIN FORM CONTROLLER
// ============================================================

"use client";

import { useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useGetQuotationByIdQuery,
} from "@/modules/sales/quotation/api/quotation.api";
import type { QuotationCreatePayload } from "@/modules/sales/quotation/types/quotation.types";
import { notify } from "@/lib/toast";

import { QuotationDetailsSection } from "./quotation-details-section";
import { QuotationPartiesSection } from "./quotation-parties-section";
import { QuotationItemsSection } from "./quotation-items-section";
import { QuotationPaymentSection } from "./quotation-payment-section";
import { QuotationSummarySection } from "./quotation-summary-section";
import { QuotationSignatureSection } from "./quotation-signature-section";
import { QuotationTermsSection } from "./quotation-terms-section";
import { QuotationFormActions } from "./quotation-form-actions";

import { quotationSchema, type QuotationFormValues } from "./quotation.schema";

interface QuotationFormProps {
  mode: "create" | "edit";
  quotationId?: string;
}

const defaultValues: QuotationFormValues = {
  quotationDate: new Date().toISOString().split("T")[0],
  validUntil: "",
  status: "draft",
  currency: "INR",
  referenceNumber: "",
  notes: "",
  internalNotes: "",

  // From
  fromName: "",
  fromEmail: "",
  fromPhone: "",
  fromGstin: "",
  fromPan: "",
  fromAddressLine1: "",
  fromAddressLine2: "",
  fromCity: "",
  fromState: "",
  fromCountry: "India",
  fromPincode: "",
  fromLogoUrl: "",
  fromWebsite: "",

  // To
  customerId: null,
  toName: "",
  toEmail: "",
  toPhone: "",
  toGstin: "",
  toPan: "",
  toContactPerson: "",
  toAddressLine1: "",
  toAddressLine2: "",
  toCity: "",
  toState: "",
  toCountry: "India",
  toPincode: "",

  // Items
  items: [
    {
      name: "",
      description: "",
      quantity: 1,
      unit: "pcs",
      rate: 0,
      discountType: "percentage",
      discountValue: 0,
      taxRate: 0,
      taxAmount: 0,
      amount: 0,
    },
  ],

  // Summary
  subtotal: 0,
  discountTotal: 0,
  taxTotal: 0,
  otherCharges: 0,
  roundOff: 0,
  grandTotal: 0,

  // Payment
  paymentTerms: "",
  bankAccountId: null,
  bankName: "",
  accountNumber: "",
  ifsc: "",
  upiId: "",
  paymentInstructions: "",

  // Signature
  authorizedPerson: "",
  designation: "",
  signatureUrl: "",

  // Terms
  termsPayment: "",
  termsDelivery: "",
  termsWarranty: "",
  termsOther: "",
  termsContent: "",
};

export function QuotationForm({ mode, quotationId }: QuotationFormProps) {
  const router = useRouter();

  const methods = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset, control, watch, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Fetch existing quotation for edit mode
  const { data: quotationData, isLoading: isLoadingQuotation } =
    useGetQuotationByIdQuery(quotationId!, {
      skip: mode !== "edit" || !quotationId,
    });

  const [createQuotation, { isLoading: isCreating }] =
    useCreateQuotationMutation();
  const [updateQuotation, { isLoading: isUpdating }] =
    useUpdateQuotationMutation();

  const isSubmitting = isCreating || isUpdating;

  // Populate form in edit mode
  useEffect(() => {
    if (mode === "edit" && quotationData?.data) {
      const q = quotationData.data;
      reset({
        quotationDate: q.quotationDate?.split("T")[0] || "",
        validUntil: q.validUntil?.split("T")[0] || "",
        status: q.status,
        currency: q.currency || "INR",
        referenceNumber: q.referenceNumber || "",
        notes: q.notes || "",
        internalNotes: q.internalNotes || "",

        fromName: q.fromName || "",
        fromEmail: q.fromEmail || "",
        fromPhone: q.fromPhone || "",
        fromGstin: q.fromGstin || "",
        fromPan: q.fromPan || "",
        fromAddressLine1: q.fromAddressLine1 || "",
        fromAddressLine2: q.fromAddressLine2 || "",
        fromCity: q.fromCity || "",
        fromState: q.fromState || "",
        fromCountry: q.fromCountry || "India",
        fromPincode: q.fromPincode || "",
        fromLogoUrl: q.fromLogoUrl || "",
        fromWebsite: q.fromWebsite || "",

        customerId: q.customerId || null,
        toName: q.toName || "",
        toEmail: q.toEmail || "",
        toPhone: q.toPhone || "",
        toGstin: q.toGstin || "",
        toPan: q.toPan || "",
        toContactPerson: q.toContactPerson || "",
        toAddressLine1: q.toAddressLine1 || "",
        toAddressLine2: q.toAddressLine2 || "",
        toCity: q.toCity || "",
        toState: q.toState || "",
        toCountry: q.toCountry || "India",
        toPincode: q.toPincode || "",

        items: q.items?.length ? q.items : defaultValues.items,

        subtotal: q.subtotal || 0,
        discountTotal: q.discountTotal || 0,
        taxTotal: q.taxTotal || 0,
        otherCharges: q.otherCharges || 0,
        roundOff: q.roundOff || 0,
        grandTotal: q.grandTotal || 0,

        paymentTerms: q.paymentTerms || "",
        bankAccountId: q.bankAccountId || null,
        bankName: q.bankName || "",
        accountNumber: q.accountNumber || "",
        ifsc: q.ifsc || "",
        upiId: q.upiId || "",
        paymentInstructions: q.paymentInstructions || "",

        authorizedPerson: q.authorizedPerson || "",
        designation: q.designation || "",
        signatureUrl: q.signatureUrl || "",

        termsPayment: q.termsPayment || "",
        termsDelivery: q.termsDelivery || "",
        termsWarranty: q.termsWarranty || "",
        termsOther: q.termsOther || "",
        termsContent: q.termsContent || "",
      });
    }
  }, [mode, quotationData, reset]);

  // Calculate totals whenever items change
  const items = watch("items");

  useEffect(() => {
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discountValue = Number(item.discountValue) || 0;
      const taxRate = Number(item.taxRate) || 0;

      const lineGross = qty * rate;
      let lineDiscount = 0;

      if (item.discountType === "percentage") {
        lineDiscount = (lineGross * discountValue) / 100;
      } else {
        lineDiscount = discountValue;
      }

      const taxable = lineGross - lineDiscount;
      const lineTax = (taxable * taxRate) / 100;

      subtotal += lineGross;
      discountTotal += lineDiscount;
      taxTotal += lineTax;
    });

    const otherCharges = Number(watch("otherCharges")) || 0;
    const roundOff = Number(watch("roundOff")) || 0;
    const grandTotal =
      subtotal - discountTotal + taxTotal + otherCharges + roundOff;

    setValue("subtotal", Number(subtotal.toFixed(2)), { shouldDirty: false });
    setValue("discountTotal", Number(discountTotal.toFixed(2)), {
      shouldDirty: false,
    });
    setValue("taxTotal", Number(taxTotal.toFixed(2)), { shouldDirty: false });
    setValue("grandTotal", Number(grandTotal.toFixed(2)), {
      shouldDirty: false,
    });
  }, [items, setValue, watch]);

  const onSubmit = async (values: QuotationFormValues) => {
    try {
      const payload: QuotationCreatePayload = {
        ...values,
        customerId: values.customerId || null,
        bankAccountId: values.bankAccountId || null,
      };

      if (mode === "create") {
        const res = await createQuotation(payload).unwrap();
        notify.success("Quotation created successfully");
        router.push(`/sales/quotations/${res.data.id}`);
      } else if (mode === "edit" && quotationId) {
        await updateQuotation({ id: quotationId, data: payload }).unwrap();
        notify.success("Quotation updated successfully");
        router.push(`/sales/quotations/${quotationId}`);
      }
    } catch (error: any) {
      notify.error(error?.data?.message || "Something went wrong");
    }
  };

  if (mode === "edit" && isLoadingQuotation) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading quotation...</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Actions */}
        <QuotationFormActions
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT COLUMN - Main Content */}
          <div className="space-y-6 xl:col-span-2">
            <QuotationDetailsSection />
            <QuotationPartiesSection />
            <QuotationItemsSection
              fields={fields}
              append={append}
              remove={remove}
            />
            <QuotationTermsSection />
          </div>

          {/* RIGHT COLUMN - Side panels */}
          <div className="space-y-6">
            <QuotationSummarySection />
            <QuotationPaymentSection />
            <QuotationSignatureSection />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}