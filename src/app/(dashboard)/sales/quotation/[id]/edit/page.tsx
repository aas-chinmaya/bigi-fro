"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import QuotationForm from "@/modules/sales/quotation/components/form/quotation-form";
import { useGetQuotationByIdQuery } from "@/modules/sales/quotation/api/quotation.api";

interface EditQuotationPageProps {
  params: Promise<{ id: string }>;
}

export default function EditQuotationPage({ params }: EditQuotationPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading, isError } = useGetQuotationByIdQuery(id);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading quotation…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-10 text-center text-sm text-destructive">
        Unable to load quotation.
      </div>
    );
  }

  const quotation =
    data && typeof data === "object" && "data" in data
      ? (data as { data: typeof data }).data
      : data;

  return (
    <div className="w-full space-y-4 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Edit quotation</h1>
        <p className="text-sm text-muted-foreground">
          {(quotation as { quotationNumber?: string })?.quotationNumber || id}
        </p>
      </div>

      <QuotationForm
        mode="edit"
        quotation={quotation as any}
        onSuccess={() => router.push("/sales/quotation")}
        onCancel={() => router.push(`/sales/quotation/${id}`)}
      />
    </div>
  );
}
