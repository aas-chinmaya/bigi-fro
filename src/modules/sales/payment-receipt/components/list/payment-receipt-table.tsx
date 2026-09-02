
"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import PaymentReceiptFilters from "./payment-receipt-filters";

import {
  PaymentReceiptColumns,
} from "./payment-receipt-columns";

import type { PaymentReceipt } from "../../types/payment-receipt.types";

// ==========================================================
// PROPS
// ==========================================================

interface PaymentReceiptTableProps {
  paymentReceipts: PaymentReceipt[];

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

export default function PaymentReceiptTable({
  paymentReceipts,
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: PaymentReceiptTableProps) {
  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [period, setPeriod] =
    useState("all");

  // ========================================================
  // FILTER
  // ========================================================

  const filteredPaymentReceipts =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      return paymentReceipts.filter(
        (paymentReceipt) => {
          // -----------------------------------------------
          // SEARCH
          // -----------------------------------------------

          const matchesSearch =
            (
              paymentReceipt.receiptNo ??
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              paymentReceipt.customerName ??
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              paymentReceipt.referenceNo ??
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
                  paymentReceipt.status ??
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
                paymentReceipt.receiptDate ??
                paymentReceipt.createdAt ??
                paymentReceipt.updatedAt;

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
      paymentReceipts,
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

        <PaymentReceiptFilters
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
        columns={PaymentReceiptColumns}
        data={filteredPaymentReceipts}
        loading={loading}
        emptyMessage="No payment receipts found."
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
