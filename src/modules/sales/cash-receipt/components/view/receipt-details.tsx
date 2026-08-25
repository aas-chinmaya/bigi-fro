"use client";

import {
  ArrowLeft,
  Download,
  Pencil,
  Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCashReceiptQuery } from "../../hooks/use-cash-receipt-query";
import { generateCashReceiptPdf } from "../../lib/cash-receipt-pdf";

interface ReceiptDetailsProps {
  id: string;
}

export default function ReceiptDetails({
  id,
}: ReceiptDetailsProps) {
  const router = useRouter();

  const {
    cashReceipt,
    loading,
    error,
  } = useCashReceiptQuery(undefined, id);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        <div className="rounded-lg border p-6 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!cashReceipt) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Cash receipt not found.
        </div>
      </div>
    );
  }

  const amount = Number(
    cashReceipt.amount ?? 0,
  );

  const handleDownloadPdf = () => {
    generateCashReceiptPdf(cashReceipt);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Cash Receipt
            </h1>

            <p className="text-sm text-muted-foreground">
              {cashReceipt.receiptNo ?? "-"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                `/sales/cash-receipt/${id}/edit`,
              )
            }
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="mr-2 size-4" />
            Print
          </Button>

          <Button
            type="button"
            onClick={handleDownloadPdf}
          >
            <Download className="mr-2 size-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Receipt */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>
                Cash Receipt
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {cashReceipt.receiptNo ?? "-"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Receipt Date
              </p>

              <p className="font-medium">
                {formatDate(
                  cashReceipt.receiptDate,
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Customer */}
          <div className="mb-8">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Received From
            </p>

            <p className="text-lg font-semibold">
              {cashReceipt.customerName ??
                "No customer"}
            </p>
          </div>

          {/* Information */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Receipt Type"
              value={formatLabel(
                cashReceipt.receiptType,
              )}
            />

            <DetailItem
              label="Payment Method"
              value={formatLabel(
                cashReceipt.paymentMethod,
              )}
            />

            <DetailItem
              label="Account"
              value={
                cashReceipt.accountName ??
                cashReceipt.accountId ??
                "-"
              }
            />

            <DetailItem
              label="Reference No"
              value={
                cashReceipt.referenceNo ?? "-"
              }
            />

            <DetailItem
              label="Status"
              value={formatLabel(
                cashReceipt.status,
              )}
            />

            <DetailItem
              label="Amount"
              value={`Rs. ${amount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}`}
              valueClassName="text-lg font-semibold"
            />
          </div>

          {/* Remarks */}
          {cashReceipt.remarks && (
            <div className="mt-8 border-t pt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Remarks
              </p>

              <p className="text-sm">
                {cashReceipt.remarks}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground print:block">
        This is a system generated cash receipt.
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p
        className={
          valueClassName || "font-medium"
        }
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(
  value?: string | null,
) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLabel(
  value?: string | null,
) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}