"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  useGetQuotationsQuery,
} from "@/modules/sales/quotation/api/quotation.api";

import QuotationTable from "@/modules/sales/quotation/components/list/quotation-table";

export default function SalesQuotationListPage() {
  const router = useRouter();

  // ==========================================================
  // QUERY STATE
  // ==========================================================

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("all");

  // ==========================================================
  // QUERY PARAMS
  // ==========================================================

  const getDateParams = () => {
    if (period === "all") {
      return {};
    }

    const now = new Date();

    const formatDate = (date: Date) =>
      date.toISOString().split("T")[0];

    switch (period) {
      case "today": {
        return {
          fromDate: formatDate(now),
          toDate: formatDate(now),
        };
      }

      case "7d": {
        const from = new Date(now);

        from.setDate(now.getDate() - 6);

        return {
          fromDate: formatDate(from),
          toDate: formatDate(now),
        };
      }

      case "30d": {
        const from = new Date(now);

        from.setDate(now.getDate() - 29);

        return {
          fromDate: formatDate(from),
          toDate: formatDate(now),
        };
      }

      case "month": {
        const from = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );

        return {
          fromDate: formatDate(from),
          toDate: formatDate(now),
        };
      }

      case "year": {
        const from = new Date(
          now.getFullYear(),
          0,
          1,
        );

        return {
          fromDate: formatDate(from),
          toDate: formatDate(now),
        };
      }

      default:
        return {};
    }
  };

  const dateParams = getDateParams();

  // ==========================================================
  // RTK QUERY
  // ==========================================================

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetQuotationsQuery({
    page,
    limit: 10,

    search: search.trim() || undefined,

    status:
      status !== ""
        ? (status as
            | "DRAFT"
            | "SENT"
            | "ACCEPTED"
            | "REJECTED"
            | "EXPIRED"
            | "CANCELLED")
        : undefined,

    ...dateParams,
  });

  // ==========================================================
  // DATA
  // ==========================================================

  const quotations = data?.data ?? [];

  const totalPages =
    data?.pagination?.totalPages ?? 1;

  const loading =
    isLoading || isFetching;

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: string,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handlePeriodChange = (
    value: string,
  ) => {
    setPeriod(value);
    setPage(1);
  };

  const handlePageChange = (
    nextPage: number,
  ) => {
    setPage(nextPage);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

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
            router.push(
              "/sales/quotation/create",
            )
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {/* {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load quotations.
        </div>
      )} */}

      {/* ======================================================
          TABLE
      ====================================================== */}

      <QuotationTable
        quotations={quotations}
        loading={loading}
        page={page}
        totalPages={totalPages}
        search={search}
        status={status}
        period={period}
        onSearchChange={
          handleSearchChange
        }
        onStatusChange={
          handleStatusChange
        }
        onPeriodChange={
          handlePeriodChange
        }
        onPageChange={
          handlePageChange
        }
      />
    </div>
  );
}