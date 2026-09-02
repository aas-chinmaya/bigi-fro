
"use client";

import {
  ArrowLeft,
  Download,
  FileText,
  Hash,
  IndianRupee,
  MessageSquare,
  Printer,
  Receipt,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { usePaymentReceiptQuery } from "../../hooks/use-payment-receipt-query";
import { generatePaymentReceiptPdf } from "../../lib/payment-receipt-pdf";

// ==========================================================
// PROPS
// ==========================================================

interface ReceiptDetailsProps {
  id: string;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function ReceiptDetails({
  id,
}: ReceiptDetailsProps) {
  const router = useRouter();

  const {
    paymentReceipt,
    loading,
    error,
  } = usePaymentReceiptQuery(undefined, id);

  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  // ========================================================
  // ERROR / NOT FOUND
  // ========================================================

  if (error || !paymentReceipt) {
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

        <div
          className={`rounded-lg border p-6 text-sm ${
            error
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {error || "Money receipt not found."}
        </div>
      </div>
    );
  }

  // ========================================================
  // DATA
  // ========================================================

  const amount = Number(
    paymentReceipt.amount ?? 0,
  );

  const status = (
    paymentReceipt.receiptStatus ?? ""
  ).toUpperCase();

  const statusVariant =
    status === "POSTED"
      ? "success"
      : status === "DRAFT"
        ? "secondary"
        : "outline";

  // ========================================================
  // DOWNLOAD PDF
  // ========================================================

  const handleDownloadPdf = () => {
    try {
      generatePaymentReceiptPdf(
        paymentReceipt,
      );

      notify.success(
        "PDF downloaded successfully",
      );
    } catch {
      notify.error(
        "Unable to generate PDF. Please try again.",
      );
    }
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {/* Header */}

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
            <h1 className="text-xl font-semibold tracking-tight">
              Money Receipt
            </h1>

            <p className="text-sm text-muted-foreground">
              {paymentReceipt.receiptNumber ?? "-"}
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 size-3.5" />

            Print
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadPdf}
          >
            <Download className="mr-2 size-3.5" />

            Download PDF
          </Button>
        </div>
      </div>

      {/* ==================================================
          MONEY RECEIPT CARD
      ================================================== */}

      <Card className="overflow-hidden print:border print:shadow-none">
        {/* Header */}

        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Receipt Title */}

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Receipt className="size-4" />
              </div>

              <div>
                <CardTitle className="text-base">
                  Payment Receipt
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  {paymentReceipt.receiptNumber ?? "-"}
                </p>
              </div>
            </div>

            {/* Status */}

            <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
              <Badge
                variant={statusVariant as any}
                className="text-xs"
              >
                {status || "-"}
              </Badge>

              <p className="text-xs text-muted-foreground">
                {formatDate(
                  paymentReceipt.receiptDate,
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <CardContent className="space-y-6 p-5">
          {/* =================================================
              CUSTOMER
          ================================================= */}

          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <User className="size-3" />

              Received From
            </p>

            <p className="text-base font-semibold leading-snug">
              {paymentReceipt.customerName ??
                "No customer"}
            </p>

            {paymentReceipt.customerId && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                ID: {paymentReceipt.customerId}
              </p>
            )}
              {paymentReceipt.customerPhone && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Phone: {paymentReceipt.customerPhone}
                </p>
              )}

              {paymentReceipt.customerGSTIN && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  GSTIN: {paymentReceipt.customerGSTIN}
                </p>
              )}
          </div>

          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              icon={<FileText className="size-3" />}
              label="Receipt Status"
              value={formatLabel(paymentReceipt.receiptStatus ?? "RECEIVED")}
            />

            <DetailItem
              icon={<Wallet className="size-3" />}
              label="Receipt Source"
              value={formatLabel(paymentReceipt.receiptSource ?? "POS")}
            />

            <DetailItem
              icon={<Hash className="size-3" />}
              label="Financial Year"
              value={paymentReceipt.financialYear ?? "-"}
            />

            <DetailItem
              icon={<IndianRupee className="size-3" />}
              label="Amount"
              value={`₹ ${amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              valueClassName="text-base font-semibold text-primary"
            />
          </div>

          {/* =================================================
              REMARKS
          ================================================= */}

          {paymentReceipt.remarks && (
            <div className="border-t pt-5">
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="size-3" />

                Remarks
              </p>

              <p className="text-sm leading-relaxed text-foreground/90">
                {paymentReceipt.remarks}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================================================
          PRINT FOOTER
      ================================================== */}

      <p className="hidden text-center text-[10px] text-muted-foreground print:block">
        This is a system generated money receipt.
      </p>
    </div>
  );
}

// ==========================================================
// DETAIL ITEM
// ==========================================================

function DetailItem({
  label,
  value,
  icon,
  valueClassName = "",
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-0.5">
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon}

        {label}
      </p>

      <p
        className={
          valueClassName ||
          "text-sm font-medium"
        }
      >
        {value}
      </p>
    </div>
  );
}

// ==========================================================
// FORMAT DATE
// ==========================================================

function formatDate(
  value?: string | null,
) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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
// FORMAT LABEL
// ==========================================================

function formatLabel(
  value?: string | null,
) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );
}
