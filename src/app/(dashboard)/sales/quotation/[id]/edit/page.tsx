"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import QuotationForm from "@/modules/sales/quotation/components/quotation-form";
import {
  useGetQuotationByIdQuery,
} from "@/modules/sales/quotation/api/quotation.api";

interface EditQuotationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditQuotationPage({
  params,
}: EditQuotationPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
  } = useGetQuotationByIdQuery(id);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading quotation...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-destructive">
          Unable to load quotation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Quotation
        </h1>

        <p className="text-sm text-muted-foreground">
          Update quotation details and items.
        </p>
      </div>

      <QuotationForm
        mode="edit"
        quotation={data.data ?? data }
        onSuccess={() => router.push("/sales/quotation")}
      />
    </div>
  );
}