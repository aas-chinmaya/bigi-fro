"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import CashReceiptFilters from "./cash-receipt-filters";
import { CashReceiptColumns } from "./cash-receipt-columns";

import type { CashReceipt } from "../../types/cash-receipt.types";

interface CashReceiptTableProps {
  cashReceipts: CashReceipt[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function CashReceiptTable({
  cashReceipts,
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
}: CashReceiptTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("all");

  const filteredCashReceipts = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return cashReceipts.filter((cashReceipt) => {
      const matchesSearch =
        (cashReceipt.receiptNo ?? "")
          .toLowerCase()
          .includes(searchText) ||
        (cashReceipt.customerName ?? "")
          .toLowerCase()
          .includes(searchText) ||
        (cashReceipt.referenceNo ?? "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus = status
        ? (cashReceipt.status ?? "").toUpperCase() ===
          status.toUpperCase()
        : true;

      const matchesPeriod = (() => {
        const receiptDateValue =
          cashReceipt.receiptDate ??
          cashReceipt.createdAt ??
          cashReceipt.updatedAt;

        if (!receiptDateValue) {
          return period === "all";
        }

        const receiptDate =
          new Date(receiptDateValue);

        if (
          Number.isNaN(
            receiptDate.getTime(),
          )
        ) {
          return period === "all";
        }

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        switch (period) {
          case "today":
            return (
              receiptDate >= startOfToday &&
              receiptDate <= now
            );

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

          case "month":
            return (
              receiptDate.getFullYear() ===
                now.getFullYear() &&
              receiptDate.getMonth() ===
                now.getMonth()
            );

          case "year":
            return (
              receiptDate.getFullYear() ===
              now.getFullYear()
            );

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
    });
  }, [
    cashReceipts,
    period,
    search,
    status,
  ]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <Search
          placeholder="Search cash receipt..."
          value={search}
          onChange={setSearch}
        />

        <CashReceiptFilters
          value={status}
          onChange={setStatus}
          period={period}
          onPeriodChange={setPeriod}
        />
      </TableToolbar>

      <DataTable
        columns={CashReceiptColumns}
        data={filteredCashReceipts}
        loading={loading}
        emptyMessage="No cash receipts found."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange ?? (() => {})}
      />
    </div>
  );
}