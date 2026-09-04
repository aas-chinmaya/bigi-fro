"use client";

import { useMemo, useState } from "react";
import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import InvoiceFilters from "./invoice-filters";
import { InvoiceColumns } from "./invoice-columns";

import { InvoiceListItem } from "../../types/invoice-list.types";

interface InvoiceTableProps {
  invoices: InvoiceListItem[];
  loading?: boolean;

  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;

  // Controlled filters
  search?: string;
  onSearchChange?: (v: string) => void;
  status?: string;
  onStatusChange?: (v: string) => void;
  period?: string;
  onPeriodChange?: (v: string) => void;
}

export default function InvoiceTable({
  invoices,
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
}: InvoiceTableProps) {
  // Server returns filtered list; use directly

  const { invoicesMeta } = useInvoiceQuery();

  const effectiveTotalPages =
    totalPages && totalPages > 1
      ? totalPages
      : invoicesMeta?.totalPages ?? 1;

  const effectivePage = page ?? invoicesMeta?.page ?? 1;

  return (
    <div className="space-y-2">
      <TableToolbar className="p-2 gap-2 rounded-md">
        <Search
          placeholder="Search invoice..."
          value={search}
          onChange={onSearchChange}
        />

        <InvoiceFilters
          value={status}
          onChange={onStatusChange}
          period={period}
          onPeriodChange={onPeriodChange}
        />
      </TableToolbar>

      <DataTable
        columns={InvoiceColumns}
        data={invoices}
        loading={loading}
        emptyMessage="No invoices found."
      />

      <Pagination
        page={effectivePage}
        totalPages={effectiveTotalPages}
        onPageChange={onPageChange ?? (() => {})}
      />
    </div>
  );
}