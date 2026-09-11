"use client";

import { useRouter } from "next/navigation";

import { QuotationForm } from "../shared/quotation-form";
import { emptyQuotationItem } from "../../schema/quotation-item.schema";
import { defaultQuotationFormValues } from "../../schema/quotation.schema";

export function CreateQuotationPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">New Quotation</h1>
        <p className="text-sm text-gray-500">
          Fill in the customer and item details to create a quotation.
        </p>
      </div>

      <QuotationForm
        mode="create"
        defaultValues={{
          ...defaultQuotationFormValues,
          items: [{ ...emptyQuotationItem }],
        }}
        onSuccess={(id) => router.push(`/sales/quotation/${id}`)}
      />
    </div>
  );
}
