"use client";

import { ArrowLeft, PanelRightOpen } from "lucide-react";
import type { Quotation } from "../../../types/quotation.types";
import { useRouter } from "next/navigation";

interface QuotationViewHeaderProps {
  quotation: Quotation;
  onOpenSidebar: () => void;
}

export function QuotationViewHeader({
  quotation,
  onOpenSidebar,
}: QuotationViewHeaderProps) {
    const router = useRouter();
  
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-surface px-4 sm:px-5">
      <div className="flex items-center gap-3">
          <button
                      onClick={() => router.push("/sales/payment-receipt")}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                      title="Back to list"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
        
        <div className="mt-0.5 flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">
            {quotation.quotationNumber}
          </h1>
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium uppercase text-white">
            {quotation.status}
          </span>
        </div>
      </div>

      <button
        onClick={onOpenSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:text-gray-800 lg:hidden"
      >
        <PanelRightOpen className="h-4 w-4" />
      </button>
    </div>
  );
}