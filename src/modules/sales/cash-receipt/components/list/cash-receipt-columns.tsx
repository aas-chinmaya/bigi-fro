
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui";

import type { CashReceipt } from "../../types/cash-receipt.types";

import CashReceiptActions from "./cash-receipt-actions";

export const CashReceiptColumns: ColumnDef<CashReceipt>[] = [
  {
    accessorKey: "receiptNo",
    header: "Receipt",

    cell: ({ row }) => {
      const cashReceipt = row.original;

      return (
        <div className="min-w-[160px]">
          <p className="font-medium">{cashReceipt.receiptNo ?? "-"}</p>
          <p className="text-xs text-muted-foreground">
            {cashReceipt.customerName ?? "No customer"}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "receiptDate",
    header: "Receipt Date",

    cell: ({ row }) => {
      const date = row.original.receiptDate;

      if (!date) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <span>
          {new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  {
    accessorKey: "amount",
    header: "Amount",

    cell: ({ row }) => {
      const amount = Number(row.original.amount ?? 0);

      return (
        <p className="font-medium">
          ₹
          {amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      );
    },
  },

  {
    accessorKey: "paymentMethod",
    header: "Payment Method",

    cell: ({ row }) => {
      const method = (row.original.paymentMethod ?? "").replaceAll("_", " ");

      return (
        <span className="capitalize">{method.toLowerCase() || "-"}</span>
      );
    },
  },

  {
    accessorKey: "receiptType",
    header: "Receipt Type",

    cell: ({ row }) => {
      const type = (row.original.receiptType ?? "").replaceAll("_", " ");

      return <span className="capitalize">{type.toLowerCase() || "-"}</span>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = (row.original.status ?? "").toUpperCase();

      const variant =
        status === "POSTED"
          ? "success"
          : status === "DRAFT"
            ? "secondary"
            : "outline";

      return <Badge variant={variant}>{status || "-"}</Badge>;
    },
  },

  {
    id: "actions",

    header: () => <div className="text-right">Actions</div>,

    cell: ({ row }) => {
      const cashReceipt = row.original;

      return (
        <div className="text-right">
          <CashReceiptActions
            id={cashReceipt.id}
            receiptNo={cashReceipt.receiptNo ?? undefined}
            status={cashReceipt.status}
          />
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];