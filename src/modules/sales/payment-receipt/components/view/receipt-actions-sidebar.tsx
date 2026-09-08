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
import { generatePaymentReceiptPdf } from "../../lib/payment-receipt-pdf";
import QuotationActionButton from "@/modules/sales/quotation/components/view/quotation-action-button";
import QuotationActivityItem from "@/modules/sales/quotation/components/view/quotation-activity-item";


import PaymentAdjustmentDialog from "./payment-adjustment-dialog";

interface ReceiptActionsSidebarProps {
  paymentReceipt: PaymentReceipt;
}

export default function ReceiptActionsSidebar({
  paymentReceipt,
}: ReceiptActionsSidebarProps) {
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const handleDownloadPdf = () => {
    try {
      generatePaymentReceiptPdf(paymentReceipt);
      notify.success("PDF downloaded successfully");
    } catch {
      notify.error("Unable to generate PDF. Please try again.");
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
        <div className="flex flex-col gap-0.5">
          <QuotationActionButton
            icon={Scale}
            label="Adjustment"
            color="violet"
            onClick={() => setAdjustmentOpen(true)}
          />
          <QuotationActionButton icon={Mail} label="Email" color="blue" />
          <QuotationActionButton icon={Share2} label="Share" color="violet" />
          <QuotationActionButton
            icon={Download}
            label="Download PDF"
            color="emerald"
            onClick={handleDownloadPdf}
          />
          <QuotationActionButton
            icon={Printer}
            label="Print"
            color="amber"
            onClick={() => window.print()}
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
      <div className="flex h-full flex-col overflow-y-auto">
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
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}