
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui";

import type { QuotationListItem } from "../../types/quotation.types";

import QuotationActions from "./quotation-actions";

export const QuotationColumns:
  ColumnDef<QuotationListItem>[] = [
  // ========================================================
  // QUOTATION
  // ========================================================

  {
    accessorKey: "quotationNumber",
    header: "Quotation",

    cell: ({ row }) => {
      const quotation =
        row.original;

      return (
        <div className="min-w-[180px]">
          <p className="font-medium">
            {quotation.quotationNumber ??
              "-"}
          </p>

          <p className="text-xs text-muted-foreground">
            {quotation.customerName ??
              "No customer"}
          </p>
        </div>
      );
    },
  },

  // ========================================================
  // QUOTATION DATE
  // ========================================================

  {
    accessorKey: "quotationDate",
    header: "Quotation Date",

    cell: ({ row }) => {
      const date =
        row.original.quotationDate;

      if (!date) {
        return (
          <span className="text-muted-foreground">
            -
          </span>
        );
      }

      const parsedDate =
        new Date(date);

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
  // VALID UNTIL
  // ========================================================

  {
    accessorKey: "validUntil",
    header: "Valid Until",

    cell: ({ row }) => {
      const date =
        row.original.validUntil;

      if (!date) {
        return (
          <span className="text-muted-foreground">
            -
          </span>
        );
      }

      const parsedDate =
        new Date(date);

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
  // TYPE
  // ========================================================

  {
    accessorKey: "quotationType",
    header: "Type",

    cell: ({ row }) => {
      const type =
        row.original.quotationType;

      return (
        <span>
          {type ?? "-"}
        </span>
      );
    },
  },

  // ========================================================
  // TOTAL
  // ========================================================

  {
    accessorKey: "grandTotal",
    header: "Total",

    cell: ({ row }) => {
      const amount =
        Number(
          row.original.grandTotal ??
            0,
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
  // STATUS
  // ========================================================

  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status =
        (
          row.original.status ??
          ""
        ).toUpperCase();

      const variant =
        status === "ACCEPTED"
          ? "success"
          : status === "DRAFT"
            ? "secondary"
            : status === "REJECTED"
              ? "destructive"
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
      const quotation =
        row.original;

      return (
        <div className="text-right">
          <QuotationActions
            id={quotation.id}
            quotationNumber={
              quotation.quotationNumber ??  quotation.id??
              undefined
            }
            status={
              quotation.status
            }
          />
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];
