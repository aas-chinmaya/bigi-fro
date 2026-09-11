"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "../../lib/format";
import type { QuotationTotals } from "../../lib/calculations";

interface QuotationTotalsCardProps {
  totals: QuotationTotals;
}

export function QuotationTotalsCard({ totals }: QuotationTotalsCardProps) {
  const rows: { label: string; value: string; muted?: boolean }[] = [
    { label: "Items", value: `${totals.totalItems}`, muted: true },
    { label: "Total quantity", value: formatNumber(totals.totalQuantity), muted: true },
    { label: "Subtotal", value: formatCurrency(totals.subtotal) },
    { label: "Discount", value: `- ${formatCurrency(totals.discountTotal)}` },
    { label: "Taxable amount", value: formatCurrency(totals.taxableAmount) },
    { label: "Tax", value: formatCurrency(totals.taxTotal) },
    { label: "Round off", value: formatCurrency(totals.roundOff) },
  ];

  return (
    <Card className="sticky top-6 space-y-3 p-5">
      <h3 className="text-sm font-semibold text-gray-900">Summary</h3>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between text-sm ${
              row.muted ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <span>{row.label}</span>
            <span className="font-medium text-gray-800">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Grand Total</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(totals.grandTotal)}
          </span>
        </div>
      </div>
    </Card>
  );
}
