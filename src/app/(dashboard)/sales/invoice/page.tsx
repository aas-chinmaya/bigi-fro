"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

import InvoiceTable from "@/modules/sales/invoice/components/list/invoice-table";
import DraftInvoiceTable from "@/modules/sales/invoice/components/list/draft-invoice-table";

export default function InvoiceListPage() {
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [period, setPeriod] = useState<string>("all");

  const params = useMemo(() => {
    const now = new Date();
    const range: Record<string, any> = {};

    if (period !== "all") {
      const start = new Date(now);
      switch (period) {
        case "today":
          start.setHours(0, 0, 0, 0);
          break;
        case "7d":
          start.setDate(now.getDate() - 6);
          start.setHours(0, 0, 0, 0);
          break;
        case "30d":
          start.setDate(now.getDate() - 29);
          start.setHours(0, 0, 0, 0);
          break;
        case "month":
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          break;
        case "year":
          start.setMonth(0, 0);
          start.setHours(0, 0, 0, 0);
          break;
      }

      range.fromDate = start.toISOString();
      range.toDate = now.toISOString();
    }

    return {
      page,
      limit,
      search: search || undefined,
      status: status || undefined,
      ...range,
    };
  }, [page, limit, search, status, period]);

  const {
    invoices,
    drafts,
    loading,
    getInvoices,
    getDrafts,
    invoicesMeta,
    draftsMeta,
  } = useInvoiceQuery(params);

  const [activeTab, setActiveTab] = useState<"all" | "draft">(
    "all"
  );

  useEffect(() => {
    if (activeTab === "all") {
      getInvoices(params);
    } else {
      getDrafts(params);
    }
  }, [activeTab, params]);

  // Reset page when tab changes to ensure predictable behavior
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Invoices
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer invoices
          </p>
        </div>

        <Button
          onClick={() =>
            router.push("/sales/invoice/create")
          }
          className="flex items-center gap-2 px-3 py-1"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-md border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
            activeTab === "all"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("draft")}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
            activeTab === "draft"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Drafts
        </button>
      </div>
      {/* All invoices */}
      {activeTab === "all" && (
        <InvoiceTable
          invoices={invoices}
          loading={loading}
          page={page}
          totalPages={invoicesMeta?.totalPages ?? 1}
          onPageChange={(p) => setPage(p)}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          period={period}
          onPeriodChange={setPeriod}
        />
      )}

      {/* Draft invoices */}
      {activeTab === "draft" && (
        <DraftInvoiceTable
          drafts={drafts}
          loading={loading}
          page={page}
          totalPages={draftsMeta?.totalPages ?? 1}
          onPageChange={(p) => setPage(p)}
          search={search}
          onSearchChange={setSearch}
          period={period}
          onPeriodChange={setPeriod}
        />
      )}
    </div>
  );
}