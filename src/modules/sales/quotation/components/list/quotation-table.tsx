
"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import QuotationFilters from "./quotation-filters";

import {
  QuotationColumns,
} from "./quotation-columns";

import type { QuotationListItem } from "../../types/quotation.types";

// ==========================================================
// PROPS
// ==========================================================

interface QuotationTableProps {
  quotations: QuotationListItem[];

  loading?: boolean;

  page?: number;

  totalPages?: number;

  onPageChange?: (
    page: number,
  ) => void;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function QuotationTable({
  quotations,
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: QuotationTableProps) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [period, setPeriod] =
    useState("all");

  // ========================================================
  // FILTER
  // ========================================================

  const filteredQuotations =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      return quotations.filter(
        (quotation) => {
          // -----------------------------------------------
          // SEARCH
          // -----------------------------------------------

          const matchesSearch =
            (
              quotation.quotationNumber ??
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              quotation.customerName ??
              ""
            )
              .toLowerCase()
              .includes(searchText);

          // -----------------------------------------------
          // STATUS
          // -----------------------------------------------

          const matchesStatus =
            status
              ? (
                  quotation.status ??
                  ""
                ).toUpperCase() ===
                status.toUpperCase()
              : true;

          // -----------------------------------------------
          // PERIOD
          // -----------------------------------------------

          const matchesPeriod =
            (() => {
              const quotationDateValue =
                quotation.quotationDate;

              if (!quotationDateValue) {
                return (
                  period === "all"
                );
              }

              const quotationDate =
                new Date(
                  quotationDateValue,
                );

              if (
                Number.isNaN(
                  quotationDate.getTime(),
                )
              ) {
                return (
                  period === "all"
                );
              }

              const now = new Date();

              const startOfToday =
                new Date(now);

              startOfToday.setHours(
                0,
                0,
                0,
                0,
              );

              switch (period) {
                // -----------------------------------------
                // TODAY
                // -----------------------------------------

                case "today":
                  return (
                    quotationDate >=
                      startOfToday &&
                    quotationDate <= now
                  );

                // -----------------------------------------
                // LAST 7 DAYS
                // -----------------------------------------

                case "7d": {
                  const sevenDaysAgo =
                    new Date(now);

                  sevenDaysAgo.setDate(
                    now.getDate() - 6,
                  );

                  sevenDaysAgo.setHours(
                    0,
                    0,
                    0,
                    0,
                  );

                  return (
                    quotationDate >=
                      sevenDaysAgo &&
                    quotationDate <= now
                  );
                }

                // -----------------------------------------
                // LAST 30 DAYS
                // -----------------------------------------

                case "30d": {
                  const thirtyDaysAgo =
                    new Date(now);

                  thirtyDaysAgo.setDate(
                    now.getDate() - 29,
                  );

                  thirtyDaysAgo.setHours(
                    0,
                    0,
                    0,
                    0,
                  );

                  return (
                    quotationDate >=
                      thirtyDaysAgo &&
                    quotationDate <= now
                  );
                }

                // -----------------------------------------
                // THIS MONTH
                // -----------------------------------------

                case "month":
                  return (
                    quotationDate.getFullYear() ===
                      now.getFullYear() &&
                    quotationDate.getMonth() ===
                      now.getMonth()
                  );

                // -----------------------------------------
                // THIS YEAR
                // -----------------------------------------

                case "year":
                  return (
                    quotationDate.getFullYear() ===
                    now.getFullYear()
                  );

                // -----------------------------------------
                // ALL
                // -----------------------------------------

                case "all":
                default:
                  return true;
              }
            })();

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPeriod
          );
        },
      );
    }, [
      quotations,
      period,
      search,
      status,
    ]);

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="space-y-4">
      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <TableToolbar>
        <Search
          placeholder="Search quotation..."
          value={search}
          onChange={setSearch}
        />

        <QuotationFilters
          value={status}
          onChange={setStatus}
          period={period}
          onPeriodChange={
            setPeriod
          }
        />
      </TableToolbar>

      {/* ==================================================
          TABLE
      ================================================== */}

      <DataTable
        columns={QuotationColumns}
        data={filteredQuotations}
        loading={loading}
        emptyMessage="No quotations found."
      />

      {/* ==================================================
          PAGINATION
      ================================================== */}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={
          onPageChange ??
          (() => {})
        }
      />
    </div>
  );
}
