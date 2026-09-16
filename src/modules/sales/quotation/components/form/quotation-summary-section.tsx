

"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { QuotationFormValues } from "../../types/quotation-form.types";

export function QuotationSummarySection() {
  const { control } = useFormContext<QuotationFormValues>();

  const taxableAmount = useWatch({ control, name: "taxableAmount" }) ?? 0;
  const discountAmount = useWatch({ control, name: "discountAmount" }) ?? 0;
  const cgstAmount = useWatch({ control, name: "cgstAmount" }) ?? 0;
  const sgstAmount = useWatch({ control, name: "sgstAmount" }) ?? 0;
  const igstAmount = useWatch({ control, name: "igstAmount" }) ?? 0;
  const roundOffAmount = useWatch({ control, name: "roundOffAmount" }) ?? 0;
  const grandTotal = useWatch({ control, name: "grandTotal" }) ?? 0;

  const formatAmount = (value: number) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2.5 text-sm">
          <SummaryRow label="Taxable Amount" value={formatAmount(taxableAmount)} />
          <SummaryRow label="Discount" value={formatAmount(discountAmount)} />
          <SummaryRow label="CGST" value={formatAmount(cgstAmount)} />
          <SummaryRow label="SGST" value={formatAmount(sgstAmount)} />
          <SummaryRow label="IGST" value={formatAmount(igstAmount)} />
          <SummaryRow label="Round Off" value={formatAmount(roundOffAmount)} />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">Grand Total</span>
          <span className="text-lg font-semibold">
            {formatAmount(grandTotal)}
          </span>
        </div>

        <Separator />

        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Amount in Words
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed">
            Rupees {Number(grandTotal).toFixed(2)} Only
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}