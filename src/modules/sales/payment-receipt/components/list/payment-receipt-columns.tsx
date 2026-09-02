
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
    accessorKey: "receiptNo",
    header: "Receipt",

    cell: ({ row }) => {
      const paymentReceipt = row.original;

      return (
        <div className="min-w-[160px]">
          <p className="font-medium">
            {paymentReceipt.receiptNo ?? "-"}
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
  // PAYMENT METHOD
  // ========================================================

  {
    accessorKey: "paymentMethod",
    header: "Payment Method",

    cell: ({ row }) => {
      const method = (
        row.original.paymentMethod ?? ""
      ).replaceAll("_", " ");

      return (
        <span className="capitalize">
          {method.toLowerCase() || "-"}
        </span>
      );
    },
  },

  // ========================================================
  // RECEIPT TYPE
  // ========================================================

  {
    accessorKey: "receiptType",
    header: "Receipt Type",

    cell: ({ row }) => {
      const type = (
        row.original.receiptType ?? ""
      ).replaceAll("_", " ");

      return (
        <span className="capitalize">
          {type.toLowerCase() || "-"}
        </span>
      );
    },
  },

  // ========================================================
  // STATUS
  // ========================================================

  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = (
        row.original.status ?? ""
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
            receiptNo={
              paymentReceipt.receiptNo ??
              undefined
            }
            status={
              paymentReceipt.status
            }
          />
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];
