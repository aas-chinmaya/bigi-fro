"use client";

import { useMemo, useState } from "react";

import {
  DataTable,
  Pagination,
  Search,
  TableToolbar,
} from "@/components/data-table";

import InvoiceFilters from "./invoice-filters";
import { DraftInvoiceColumns } from "./draft-invoice-columns";

import type { InvoiceListItem } from "../../types/invoice-list.types";

interface DraftInvoiceTableProps {
  drafts: InvoiceListItem[];
  loading?: boolean;

  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;

  // Controlled filters
  search?: string;
  onSearchChange?: (v: string) => void;
  period?: string;
  onPeriodChange?: (v: string) => void;
}

export default function DraftInvoiceTable({
  drafts,
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  search = "",
  onSearchChange = () => {},
  period = "all",
  onPeriodChange = () => {},
}: DraftInvoiceTableProps) {
  // Server returns paginated drafts; render as-is and let parent control filtering

  return (
    <div className="space-y-2">
      <TableToolbar className="p-2 gap-2 rounded-md">
        <Search
          placeholder="Search draft invoice..."
          value={search}
          onChange={onSearchChange}
        />

        <InvoiceFilters
          value="DRAFT"
          onChange={() => {}}
          period={period}
          onPeriodChange={onPeriodChange}
          showDraftsOnly
        />
      </TableToolbar>

      <DataTable
        columns={DraftInvoiceColumns}
        data={drafts}
        loading={loading}
        emptyMessage="No draft invoices found."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange ?? (() => {})}
      />
    </div>
  );
}