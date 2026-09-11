"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useQuotationList } from "../../hooks/use-quotation-list";
import { QuotationFilters } from "./quotation-filters";
import { QuotationTable } from "./quotation-table";

export function QuotationListPage() {
  const router = useRouter();

  const {
    quotations,
    pagination,
    isLoading,
    isFetching,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    source,
    setSource,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    resetFilters,
  } = useQuotationList();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quotations</h1>
          <p className="text-sm text-gray-500">
            Create, track, and send quotations to your customers.
          </p>
        </div>

        <Button type="button" onClick={() => router.push("/sales/quotation/create")}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Quotation
        </Button>
      </div>

      <div className="mb-4">
        <QuotationFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          source={source}
          onSourceChange={setSource}
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          onReset={resetFilters}
        />
      </div>

      <QuotationTable
        quotations={quotations}
        pagination={pagination}
        isLoading={isLoading || isFetching}
        page={page}
        onPageChange={setPage}
        onResetFilters={resetFilters}
      />
    </div>
  );
}
