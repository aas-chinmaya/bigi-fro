"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { formatCurrency, formatDate } from "../../lib/format";
import { QuotationRowActions } from "./quotation-row-actions";
import { QuotationStatusBadge } from "./quotation-status-badge";
import type { Quotation } from "../../types/quotation.types";
import type { useQuotationActions } from "../../hooks/use-quotation-actions";

export function buildQuotationColumns(
  actions: ReturnType<typeof useQuotationActions>,
): ColumnDef<Quotation>[] {
  return [
    {
      accessorKey: "quotationNumber",
      header: "Quotation #",
      cell: ({ row }) => (
        <Link
          href={`/sales/quotation/${row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.quotationNumber || `#${row.original.id.slice(0, 8)}`}
        </Link>
      ),
    },
    {
      accessorKey: "quotationDate",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.quotationDate)}
        </span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-800">
            {row.original.customerName || "-"}
          </p>
          {row.original.customerPhone && (
            <p className="text-xs text-gray-400">{row.original.customerPhone}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "validUntil",
      header: "Valid Until",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{formatDate(row.original.validUntil)}</span>
      ),
    },
    {
      accessorKey: "grandTotal",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(row.original.grandTotal)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <QuotationStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <QuotationRowActions quotation={row.original} actions={actions} />,
    },
  ];
}
