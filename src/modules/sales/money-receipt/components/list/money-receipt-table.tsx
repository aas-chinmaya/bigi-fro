
"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import MoneyReceiptFilters from "./money-receipt-filters";

import {
  MoneyReceiptColumns,
} from "./money-receipt-columns";

import type { MoneyReceipt } from "../../types/money-receipt.types";

// ==========================================================
// PROPS
// ==========================================================

interface MoneyReceiptTableProps {
  moneyReceipts: MoneyReceipt[];

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

export default function MoneyReceiptTable({
  moneyReceipts,
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: MoneyReceiptTableProps) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [period, setPeriod] =
    useState("all");

  // ========================================================
  // FILTER
  // ========================================================

  const filteredMoneyReceipts =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      return moneyReceipts.filter(
        (moneyReceipt) => {
          // -----------------------------------------------
          // SEARCH
          // -----------------------------------------------

          const matchesSearch =
            (
              moneyReceipt.receiptNo ??
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              moneyReceipt.customerName ??
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              moneyReceipt.referenceNo ??
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
                  moneyReceipt.status ??
                  ""
                ).toUpperCase() ===
                status.toUpperCase()
              : true;

          // -----------------------------------------------
          // PERIOD
          // -----------------------------------------------

          const matchesPeriod =
            (() => {
              const receiptDateValue =
                moneyReceipt.receiptDate ??
                moneyReceipt.createdAt ??
                moneyReceipt.updatedAt;

              if (!receiptDateValue) {
                return (
                  period === "all"
                );
              }

              const receiptDate =
                new Date(
                  receiptDateValue,
                );

              if (
                Number.isNaN(
                  receiptDate.getTime(),
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
                    receiptDate >=
                      startOfToday &&
                    receiptDate <= now
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
                    receiptDate >=
                      sevenDaysAgo &&
                    receiptDate <= now
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
                    receiptDate >=
                      thirtyDaysAgo &&
                    receiptDate <= now
                  );
                }

                // -----------------------------------------
                // THIS MONTH
                // -----------------------------------------

                case "month":
                  return (
                    receiptDate.getFullYear() ===
                      now.getFullYear() &&
                    receiptDate.getMonth() ===
                      now.getMonth()
                  );

                // -----------------------------------------
                // THIS YEAR
                // -----------------------------------------

                case "year":
                  return (
                    receiptDate.getFullYear() ===
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
      moneyReceipts,
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
          placeholder="Search money receipt..."
          value={search}
          onChange={setSearch}
        />

        <MoneyReceiptFilters
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
        columns={MoneyReceiptColumns}
        data={filteredMoneyReceipts}
        loading={loading}
        emptyMessage="No money receipts found."
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
