"use client";

import type { Quotation } from "../../types/quotation.types";

interface QuotationPreviewProps {
  quotation: Quotation;
}

export function QuotationPreview({ quotation }: QuotationPreviewProps) {
  return (
    <div className="flex h-full w-full items-center justify-center ">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Preview area</p>
        <p className="mt-1 text-xs text-gray-400">
          {quotation.quotationNumber} • {quotation.status}
        </p>
      </div>
    </div>
  );
}