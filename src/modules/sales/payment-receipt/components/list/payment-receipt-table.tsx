
"use client";


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

  // Controlled filters (moved to parent for server-side queries)
  search?: string;
  onSearchChange?: (v: string) => void;
  status?: string;
  onStatusChange?: (v: string) => void;
  period?: string;
  onPeriodChange?: (v: string) => void;
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
  search = "",
  onSearchChange = () => {},
  status = "",
  onStatusChange = () => {},
  period = "all",
  onPeriodChange = () => {},
}: PaymentReceiptTableProps) {
  // filters controlled by parent; no local state to avoid duplicate server/client filtering

  // ========================================================
  // FILTER
  // ========================================================

  // Server provides filtered list via params; use data directly
  const filteredPaymentReceipts = paymentReceipts;

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
          onChange={onSearchChange}
        />

        <PaymentReceiptFilters
          value={status}
          onChange={onStatusChange}
          period={period}
          onPeriodChange={onPeriodChange}
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
