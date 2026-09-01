
"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useQuotation } from "@/modules/sales/quotation/hooks/use-quotation";

import QuotationTable from "@/modules/sales/quotation/components/list/quotation-table";

export default function SalesQuotationListPage() {
  const router = useRouter();

  const {
    quotations,
    loading,
    page,
    totalPages,
  } = useQuotation();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Quotations
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer quotations
          </p>
        </div>

        <Button
          onClick={() =>
            router.push("/sales/quotation/create")
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {/* Quotation List */}
       
      <QuotationTable
        quotations={quotations}
        loading={loading}
        page={page}
        totalPages={totalPages}
      />
      
    </div>
  );
}
