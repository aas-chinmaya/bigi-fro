"use client";

import { ArrowLeft, PanelRightOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Quotation, QuotationStatus } from "../../../types/quotation.types";

interface QuotationViewHeaderProps {
  quotation: Quotation;
  onOpenSidebar: () => void;
}

const STATUS_STYLES: Record<QuotationStatus, { bg: string; label: string }> = {
  DRAFT: { bg: "bg-[var(--neutral)]", label: "Draft" },
  SENT: { bg: "bg-[var(--info)]", label: "Sent" },
  ACCEPTED: { bg: "bg-[var(--success)]", label: "Accepted" },
  REJECTED: { bg: "bg-[var(--danger)]", label: "Rejected" },
  CANCELLED: { bg: "bg-[var(--danger)]", label: "Cancelled" },
  EXPIRED: { bg: "bg-[var(--warning)]", label: "Expired" },
};

export function QuotationViewHeader({
  quotation,
  onOpenSidebar,
}: QuotationViewHeaderProps) {
  const router = useRouter();
  const status = quotation.quotationStatus;
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-surface px-4 sm:px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          title="Back to list"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="mt-0.5 flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">
            {quotation.quotationNumber ?? "Quotation"}
          </h1>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase text-white ${style.bg}`}
          >
            {style.label}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:text-gray-800 lg:hidden"
        title="Open settings"
      >
        <PanelRightOpen className="h-4 w-4" />
      </button>
    </div>
  );
}