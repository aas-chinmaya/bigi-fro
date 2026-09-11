"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui";

import type { Quotation } from "../../types/quotation.types";

import QuotationActions from "./quotation-actions";

// ==========================================================
// DATE FORMATTER
// ==========================================================

function formatDate(
  value?: string,
) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

// ==========================================================
// COLUMNS
// ==========================================================

export const QuotationColumns: ColumnDef<Quotation>[] =
  [
    // ========================================================
    // QUOTATION
    // ========================================================

    {
      accessorKey:
        "quotationNumber",

      header: "Quotation",

      cell: ({ row }) => {
        const quotation =
          row.original;

        return (
          <div className="min-w-[180px]">
            <p className="font-medium">
              {quotation.quotationNumber ??
                quotation.id}
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
      accessorKey:
        "quotationDate",

      header: "Quotation Date",

      cell: ({ row }) => (
        <span>
          {formatDate(
            row.original
              .quotationDate,
          )}
        </span>
      ),
    },

    // ========================================================
    // VALID UNTIL
    // ========================================================

    {
      accessorKey:
        "validUntil",

      header: "Valid Until",

      cell: ({ row }) => (
        <span>
          {formatDate(
            row.original
              .validUntil,
          )}
        </span>
      ),
    },

    // ========================================================
    // SOURCE
    // ========================================================

    {
      accessorKey: "source",

      header: "Source",

      cell: ({ row }) => {
        const source =
          row.original.source;

        return (
          <span className="text-sm">
            {source
              ? source
                  .replace(
                    "_",
                    " ",
                  )
                  .toLowerCase()
                  .replace(
                    /\b\w/g,
                    (char) =>
                      char.toUpperCase(),
                  )
              : "-"}
          </span>
        );
      },
    },

    // ========================================================
    // TOTAL
    // ========================================================

    {
      accessorKey:
        "totalAmount",

      header: "Total",

      cell: ({ row }) => {
        const amount =
          Number(
            row.original
              .totalAmount ?? 0,
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
            row.original
              .status ?? ""
          ).toUpperCase();

        const variant =
          status === "ACCEPTED"
            ? "success"
            : status === "DRAFT"
              ? "secondary"
              : status ===
                  "REJECTED" ||
                status ===
                  "CANCELLED"
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
                quotation
                  .quotationNumber ??
                quotation.id
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