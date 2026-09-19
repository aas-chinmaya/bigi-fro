"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGetQuotationsQuery } from "@/modules/sales/quotation/api/quotation.api";
import QuotationTable from "@/modules/sales/quotation/components/list/quotation-table";

export default function SalesQuotationListPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const getDateParams = () => {
    if (period === "all") return {};

    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];

    switch (period) {
      case "today":
        return { fromDate: fmt(now), toDate: fmt(now) };
      case "7d": {
        const from = new Date(now);
        from.setDate(now.getDate() - 6);
        return { fromDate: fmt(from), toDate: fmt(now) };
      }
      case "30d": {
        const from = new Date(now);
        from.setDate(now.getDate() - 29);
        return { fromDate: fmt(from), toDate: fmt(now) };
      }
      case "month":
        return {
          fromDate: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
          toDate: fmt(now),
        };
      case "year":
        return {
          fromDate: fmt(new Date(now.getFullYear(), 0, 1)),
          toDate: fmt(now),
        };
      default:
        return {};
    }
  };

  const { data, isLoading, isFetching, isError } = useGetQuotationsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: status
      ? (status as
          | "DRAFT"
          | "SENT"
          | "ACCEPTED"
          | "REJECTED"
          | "EXPIRED"
          | "CANCELLED")
      : undefined,
    ...getDateParams(),
  });

  const quotations = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quotations</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer quotations
          </p>
        </div>

        <Button
          className="w-full gap-2 sm:w-auto"
          onClick={() => router.push("/sales/quotation/create")}
        >
          <Plus className="h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load quotations. Please try again.
        </div>
      )}

      <QuotationTable
        quotations={quotations}
        loading={isLoading || isFetching}
        page={page}
        totalPages={totalPages}
        search={searchInput}
        status={status}
        period={period}
        onSearchChange={setSearchInput}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onPeriodChange={(value) => {
          setPeriod(value);
          setPage(1);
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
