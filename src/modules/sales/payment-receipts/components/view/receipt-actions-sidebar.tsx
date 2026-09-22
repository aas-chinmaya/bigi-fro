


"use client";

import { useState } from "react";
import {
  Send,
  Share2,
  FileDown,
  Printer,
  Scale,
  User,
  Calendar,
  type LucideIcon,
} from "lucide-react";

import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { PaymentReceipt } from "../../types/payment-receipt.types";
import {
  generatePaymentReceiptPdf,
  printPaymentReceiptPdf,
} from "../../lib/payment-receipt-pdf";
import PaymentAdjustmentDialog from "./payment-adjustment-dialog";

interface ReceiptActionsSidebarProps {
  paymentReceipt: PaymentReceipt;
}

type ActionColor =
  | "violet"
  | "info"
  | "success"
  | "warning"
  | "danger";

const colorStyles: Record<ActionColor, string> = {
  violet: "text-violet",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

function ActionBtn({
  icon: Icon,
  label,
  color,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  color: ActionColor;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5",
        "text-sm font-medium text-gray-700",
        "transition-colors duration-150",
        "hover:bg-neutral/5 hover:text-gray-900",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          colorStyles[color],
        )}
        strokeWidth={2}
      />

      <span>{label}</span>
    </button>
  );
}

export default function ReceiptActionsSidebar({
  paymentReceipt,
}: ReceiptActionsSidebarProps) {
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const handleDownloadPdf = () => {
    try {
      setBusy("download");
      generatePaymentReceiptPdf(paymentReceipt);
      notify.success("PDF downloaded successfully");
    } catch {
      notify.error("Unable to generate PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const handlePrint = () => {
    try {
      setBusy("print");
      printPaymentReceiptPdf(paymentReceipt);
    } catch (err: any) {
      notify.error(
        err?.message || "Unable to print. Please try again.",
      );
    } finally {
      setBusy(null);
    }
  };

  const handleEmail = () => {
    try {
      setBusy("email");

      const to =
        (paymentReceipt as any).customer?.email ||
     
        "";

      const subject = encodeURIComponent(
        `Payment Receipt ${paymentReceipt.receiptNumber ?? ""}`,
      );

      const body = encodeURIComponent(
        [
          `Dear ${paymentReceipt.customerName || "Customer"},`,
          "",
          `Please find the payment receipt details below:`,
          "",
          `Receipt No.: ${paymentReceipt.receiptNumber ?? "—"}`,
          `Date: ${formatDateTime(paymentReceipt.receiptDate)}`,
          `Amount: ₹ ${Number(
            paymentReceipt.amount ?? 0,
          ).toLocaleString("en-IN")}`,
          "",
          "Thank you.",
        ].join("\n"),
      );

      const mailto = to
        ? `mailto:${to}?subject=${subject}&body=${body}`
        : `mailto:?subject=${subject}&body=${body}`;

      window.open(mailto, "_self");
    } catch {
      notify.error("Unable to open email client.");
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    try {
      setBusy("share");

      const title = `Payment Receipt ${
        paymentReceipt.receiptNumber ?? ""
      }`;

      const text = [
        `Receipt No.: ${paymentReceipt.receiptNumber ?? "—"}`,
        `Customer: ${paymentReceipt.customerName ?? "—"}`,
        `Amount: ₹ ${Number(
          paymentReceipt.amount ?? 0,
        ).toLocaleString("en-IN")}`,
        `Date: ${formatDateTime(paymentReceipt.receiptDate)}`,
      ].join("\n");

      const shareData: ShareData = {
        title,
        text,
        url:
          typeof window !== "undefined"
            ? window.location.href
            : undefined,
      };

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          `${title}\n\n${text}\n\n${shareData.url ?? ""}`,
        );

        notify.success("Receipt details copied to clipboard");
      } else {
        notify.error(
          "Sharing is not supported on this device",
        );
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      notify.error(
        "Unable to share. Please try again.",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex flex-col gap-1.5 p-3">
          <ActionBtn
            icon={Scale}
            label="Settle & Adjust"
            color="violet"
            onClick={() => setAdjustmentOpen(true)}
          />

          <ActionBtn
            icon={Send}
            label="Mail Customer"
            color="info"
            onClick={handleEmail}
            disabled={busy === "email"}
          />

          <ActionBtn
            icon={Share2}
            label="Quick Share"
            color="danger"
            onClick={handleShare}
            disabled={busy === "share"}
          />

          <ActionBtn
            icon={FileDown}
            label="Save PDF"
            color="success"
            onClick={handleDownloadPdf}
            disabled={busy === "download"}
          />

          <ActionBtn
            icon={Printer}
            label="Print Slip"
            color="warning"
            onClick={handlePrint}
            disabled={busy === "print"}
          />
        </div>

        <div className="mx-3 border-t border-gray-100 pt-3 pb-3">
          <div className="space-y-2.5 px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral/10 text-neutral">
                <User className="h-3.5 w-3.5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Created by
                </p>

                <p className="truncate text-xs font-medium text-gray-800">
                  {paymentReceipt.createdBy || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral/10 text-neutral">
                <Calendar className="h-3.5 w-3.5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Created at
                </p>

                <p className="truncate text-xs font-medium text-gray-800">
                  {formatDateTime(paymentReceipt.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentAdjustmentDialog
        open={adjustmentOpen}
        onOpenChange={setAdjustmentOpen}
        paymentReceipt={paymentReceipt}
      />
    </>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}