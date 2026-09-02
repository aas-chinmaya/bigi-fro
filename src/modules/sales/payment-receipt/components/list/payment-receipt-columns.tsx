
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui";

import type { PaymentReceipt } from "../../types/payment-receipt.types";

import PaymentReceiptActions from "./payment-receipt-actions";

export const PaymentReceiptColumns: ColumnDef<PaymentReceipt>[] = [
  // ========================================================
  // RECEIPT
  // ========================================================

  {
    accessorKey: "receiptNumber",
    header: "Receipt",

    cell: ({ row }) => {
      const paymentReceipt = row.original;

      return (
        <div className="min-w-[160px]">
          <p className="font-medium">
            {paymentReceipt.receiptNumber ?? "-"}
          </p>

          <p className="text-xs text-muted-foreground">
            {paymentReceipt.customerName ??
              "No customer"}
          </p>
        </div>
      );
    },
  },

  // ========================================================
  // RECEIPT DATE
  // ========================================================

  {
    accessorKey: "receiptDate",
    header: "Receipt Date",

    cell: ({ row }) => {
      const date =
        row.original.receiptDate;

      if (!date) {
        return (
          <span className="text-muted-foreground">
            -
          </span>
        );
      }

      const parsedDate = new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime(),
        )
      ) {
        return (
          <span className="text-muted-foreground">
            -
          </span>
        );
      }

      return (
        <span>
          {parsedDate.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            },
          )}
        </span>
      );
    },
  },

  // ========================================================
  // AMOUNT
  // ========================================================

  {
    accessorKey: "amount",
    header: "Amount",

    cell: ({ row }) => {
      const amount = Number(
        row.original.amount ?? 0,
      );

      return (
        <p className="font-medium">
          ₹
          {amount.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}
        </p>
      );
    },
  },

  // ========================================================
  // RECEIPT SOURCE
  // ========================================================

  {
    accessorKey: "receiptSource",
    header: "Source",

    cell: ({ row }) => {
      const source = row.original.receiptSource ?? "POS";

      return <span className="capitalize">{source.toLowerCase()}</span>;
    },
  },

  // ========================================================
  // STATUS
  // ========================================================

  {
    accessorKey: "receiptStatus",
    header: "Status",

    cell: ({ row }) => {
      const status = (
        row.original.receiptStatus ?? ""
      ).toUpperCase();

      const variant =
        status === "POSTED"
          ? "success"
          : status === "DRAFT"
            ? "secondary"
            : "outline";

      return (
        <Badge variant={variant}>
          {status || "-"}
        </Badge>
      );
    },
  },

  // ========================================================
  // ACTIONS
  // ========================================================

  {
    id: "actions",

    header: () => (
      <div className="text-right">
        Actions
      </div>
    ),

    cell: ({ row }) => {
      const paymentReceipt =
        row.original;

      return (
        <div className="text-right">
          <PaymentReceiptActions
            id={paymentReceipt.id}
            receiptNumber={paymentReceipt.receiptNumber ?? undefined}
            status={paymentReceipt.receiptStatus}
          />
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];
