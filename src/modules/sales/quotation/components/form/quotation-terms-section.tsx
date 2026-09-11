// ============================================================
// components/sales/quotation/form/quotation-terms-section.tsx
// ============================================================

"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuotationFormValues } from "./quotation.schema";

export function QuotationTermsSection() {
  const { register } = useFormContext<QuotationFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Textarea
            rows={2}
            placeholder="Payment related terms..."
            {...register("termsPayment")}
          />
        </div>

        <div className="space-y-2">
          <Label>Delivery Terms</Label>
          <Textarea
            rows={2}
            placeholder="Delivery related terms..."
            {...register("termsDelivery")}
          />
        </div>

        <div className="space-y-2">
          <Label>Warranty</Label>
          <Textarea
            rows={2}
            placeholder="Warranty information..."
            {...register("termsWarranty")}
          />
        </div>

        <div className="space-y-2">
          <Label>Other Terms</Label>
          <Textarea
            rows={3}
            placeholder="Any other terms & conditions..."
            {...register("termsOther")}
          />
        </div>
      </CardContent>
    </Card>
  );
}