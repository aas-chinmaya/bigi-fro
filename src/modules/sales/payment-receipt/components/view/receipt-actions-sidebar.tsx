"use client";

import { useState } from "react";
import {
  Mail,
  Share2,
  Download,
  Printer,
  History,
  Scale,
} from "lucide-react";

import Accordion, { type AccordionSection } from "@/components/ui/accordion";
import { notify } from "@/lib/toast";
import type { PaymentReceipt } from "../../types/payment-receipt.types";
import {
  generatePaymentReceiptPdf,
  printPaymentReceiptPdf,
} from "../../lib/payment-receipt-pdf";
import ReceiptActionButton from "./receipt-action-button";
import QuotationActivityItem from "@/modules/sales/quotation/components/view/quotation-activity-item";
import PaymentAdjustmentDialog from "./payment-adjustment-dialog";

interface ReceiptActionsSidebarProps {
  paymentReceipt: PaymentReceipt;
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
      notify.error(err?.message || "Unable to print. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const handleEmail = () => {
    try {
      setBusy("email");
      const to =
        (paymentReceipt as any).customer?.email ||
        paymentReceipt.customerEmail ||
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
          `Amount: ₹ ${Number(paymentReceipt.amount ?? 0).toLocaleString("en-IN")}`,
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
      const title = `Payment Receipt ${paymentReceipt.receiptNumber ?? ""}`;
      const text = [
        `Receipt No.: ${paymentReceipt.receiptNumber ?? "—"}`,
        `Customer: ${paymentReceipt.customerName ?? "—"}`,
        `Amount: ₹ ${Number(paymentReceipt.amount ?? 0).toLocaleString("en-IN")}`,
        `Date: ${formatDateTime(paymentReceipt.receiptDate)}`,
      ].join("\n");

      const shareData: ShareData = {
        title,
        text,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      };

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${title}\n\n${text}\n\n${shareData.url ?? ""}`,
        );
        notify.success("Receipt details copied to clipboard");
      } else {
        notify.error("Sharing is not supported on this device");
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      notify.error("Unable to share. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const activity = [
    {
      title: `Created by ${paymentReceipt.createdBy || "System"}`,
      timestamp: formatDateTime(paymentReceipt.createdAt),
    },
    {
      title: `Status → ${formatLabel(paymentReceipt.receiptStatus)}`,
      timestamp: formatDateTime(paymentReceipt.updatedAt),
    },
    ...(paymentReceipt.payment
      ? [
          {
            title: `Payment via ${formatLabel(paymentReceipt.payment.paymentMethod)}`,
            timestamp: formatDateTime(paymentReceipt.payment.createdAt),
          },
        ]
      : []),
  ];

  const sections: AccordionSection[] = [
    {
      id: "actions",
      title: "Actions",
      icon: Mail,
      color: "blue",
      content: (
        <div className="flex flex-col gap-0.5 py-0.5 cursor-pointer">
          <ReceiptActionButton
            icon={Scale}
            label="Adjustment"
            color="violet"
            onClick={() => setAdjustmentOpen(true)}
          />
          <ReceiptActionButton
            icon={Mail}
            label="Email"
            color="blue"
            onClick={handleEmail}
            disabled={busy === "email"}
          />
          <ReceiptActionButton
            icon={Share2}
            label="Share"
            color="violet"
            onClick={handleShare}
            disabled={busy === "share"}
          />
          <ReceiptActionButton
            icon={Download}
            label="Download PDF"
            color="emerald"
            onClick={handleDownloadPdf}
            disabled={busy === "download"}
          />
          <ReceiptActionButton
            icon={Printer}
            label="Print"
            color="amber"
            onClick={handlePrint}
            disabled={busy === "print"}
          />
        </div>
      ),
    },
    {
      id: "activity",
      title: "Activity",
      icon: History,
      color: "violet",
      content: (
        <div className="flex flex-col pt-1">
          {activity.map((item, index) => (
            <QuotationActivityItem
              key={item.title + index}
              title={item.title}
              timestamp={item.timestamp}
              isLast={index === activity.length - 1}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex h-full flex-col overflow-y-auto ">
        <Accordion sections={sections} defaultOpenId="actions" />
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

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}