// ============================================================
// components/sales/quotation/form/quotation-summary-section.tsx
// ============================================================

"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { QuotationFormValues } from "./quotation.schema";

export function QuotationSummarySection() {
  const { register, watch } = useFormContext<QuotationFormValues>();

  const subtotal = watch("subtotal") || 0;
  const discountTotal = watch("discountTotal") || 0;
  const taxTotal = watch("taxTotal") || 0;
  const otherCharges = watch("otherCharges") || 0;
  const roundOff = watch("roundOff") || 0;
  const grandTotal = watch("grandTotal") || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹ {Number(subtotal).toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span className="text-destructive">
            - ₹ {Number(discountTotal).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>₹ {Number(taxTotal).toFixed(2)}</span>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Other Charges</Label>
          <Input
            type="number"
            step="any"
            className="h-8 text-right"
            {...register("otherCharges")}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Round Off</Label>
          <Input
            type="number"
            step="any"
            className="h-8 text-right"
            {...register("roundOff")}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between text-base font-semibold">
          <span>Grand Total</span>
          <span>₹ {Number(grandTotal).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}