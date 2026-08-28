"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { InvoiceFormValues } from "../types/invoice-form.types";
import { invoiceSchema } from "../schemas/invoice.schema";

import { DEFAULT_VALUES } from "./use-invoice-form";
import { useBusiness, type BusinessContext } from "./use-business";

// ==========================================================
// SELLER FIELDS FROM BUSINESS CONTEXT
//
// Small helper so we don't repeat this object literal in both
// the "populate on mount" effect and handleReset.
// ==========================================================

function businessDefaults(
  business: BusinessContext,
): Partial<InvoiceFormValues> {
  return {
    businessId: business.id,
    branchId: business.branchId,
    createdBy: business.createdBy,

    sellerLegalName: business.sellerLegalName,
    sellerTradeName: business.sellerTradeName,

    sellerGSTIN: business.sellerGSTIN,
    sellerPAN: business.sellerPAN,

    sellerPhone: business.sellerPhone,
    sellerEmail: business.sellerEmail,

    sellerAddressLine1: business.sellerAddressLine1,
    sellerAddressLine2: business.sellerAddressLine2,

    sellerCity: business.sellerCity,
    sellerState: business.sellerState,
    sellerStateCode: business.sellerStateCode,
    sellerPincode: business.sellerPincode,
    sellerCountry: business.sellerCountry,
  };
}

// ==========================================================
// useCreateInvoiceForm
// ==========================================================

export function useCreateInvoiceForm() {
  const { business } = useBusiness();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // --------------------------------------------------------
  // Populate business/seller context once available
  // --------------------------------------------------------

  useEffect(() => {
    if (!business) return;

    Object.entries(businessDefaults(business)).forEach(([field, value]) => {
      form.setValue(field as keyof InvoiceFormValues, value as never);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  // --------------------------------------------------------
  // Reset back to a blank form, re-seeded with business info
  // --------------------------------------------------------

  const resetForm = useCallback(() => {
    form.reset({
      ...(DEFAULT_VALUES as InvoiceFormValues),
      ...businessDefaults(business),
    });
  }, [business, form]);

  return { form, business, resetForm };
}
