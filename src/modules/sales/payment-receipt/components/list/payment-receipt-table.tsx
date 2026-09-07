




"use client";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import PaymentReceiptFilters from "./payment-receipt-filters";
import { PaymentReceiptColumns } from "./payment-receipt-columns";
import type { PaymentReceipt } from "../../types/payment-receipt.types";

interface PaymentReceiptTableProps {
  paymentReceipts: PaymentReceipt[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  // Controlled filters (parent handles server-side filtering)
  search?: string;
  onSearchChange?: (v: string) => void;
  status?: string;
  onStatusChange?: (v: string) => void;
  period?: string;
  onPeriodChange?: (v: string) => void;
}

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
  return (
    <div className="space-y-4">
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

      <DataTable
        columns={PaymentReceiptColumns}
        data={paymentReceipts}
        loading={loading}
        emptyMessage="No payment receipts found."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange ?? (() => {})}
      />
    </div>
  );
}