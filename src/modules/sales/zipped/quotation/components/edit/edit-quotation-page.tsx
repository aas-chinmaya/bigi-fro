"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { useGetQuotationByIdQuery } from "../../api/quotation.api";
import { EDITABLE_STATUSES } from "../../types/quotation.types";
import { quotationToFormValues } from "../../lib/quotation-to-form-values";
import { QuotationForm } from "../shared/quotation-form";
import { QuotationFormSkeleton } from "../shared/quotation-form-skeleton";

interface EditQuotationPageProps {
  quotationId: string;
}

export function EditQuotationPage({ quotationId }: EditQuotationPageProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetQuotationByIdQuery(quotationId);

  const quotation = data?.data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Edit Quotation</h1>
        <p className="text-sm text-gray-500">
          {quotation?.quotationNumber ? `#${quotation.quotationNumber}` : "Update the quotation details below."}
        </p>
      </div>

      {isLoading && <QuotationFormSkeleton />}

      {!isLoading && (isError || !quotation) && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-red-100 bg-red-50 py-12 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="text-sm font-medium text-red-700">Couldn&apos;t load this quotation.</p>
          <p className="text-xs text-red-500">It may have been deleted, or you may not have access.</p>
        </div>
      )}

      {!isLoading && quotation && !EDITABLE_STATUSES.includes(quotation.status) && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          This quotation is <strong className="mx-1">{quotation.status.toLowerCase()}</strong> and can
          no longer be edited.
        </div>
      )}

      {!isLoading && quotation && EDITABLE_STATUSES.includes(quotation.status) && (
        <QuotationForm
          mode="edit"
          quotationId={quotation.id}
          defaultValues={quotationToFormValues(quotation)}
          onSuccess={(id) => router.push(`/sales/quotation/${id}`)}
        />
      )}
    </div>
  );
}
