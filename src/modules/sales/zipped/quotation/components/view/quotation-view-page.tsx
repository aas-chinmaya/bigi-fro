"use client";

import { AlertTriangle, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useGetQuotationByIdQuery } from "../../api/quotation.api";
import { useQuotationActions } from "../../hooks/use-quotation-actions";
import { QuotationDocument } from "./quotation-document";
import { QuotationViewSidebar } from "./quotation-view-sidebar";
import { QuotationViewSkeleton } from "./quotation-view-skeleton";

interface QuotationViewPageProps {
  quotationId: string;
}

export function QuotationViewPage({ quotationId }: QuotationViewPageProps) {
  const { data, isLoading, isError } = useGetQuotationByIdQuery(quotationId);
  const actions = useQuotationActions();

  const quotation = data?.data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/sales/quotation"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 print:hidden"
      >
        <ChevronLeft className="h-4 w-4" /> Back to quotations
      </Link>

      {isLoading && <QuotationViewSkeleton />}

      {!isLoading && (isError || !quotation) && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="text-sm font-medium text-red-700">Couldn&apos;t load this quotation.</p>
          <Link href="/sales/quotation">
            <Button variant="outline" size="sm">
              Back to list
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && quotation && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuotationDocument quotation={quotation} />
          </div>

          <QuotationViewSidebar quotation={quotation} actions={actions} />
        </div>
      )}
    </div>
  );
}
