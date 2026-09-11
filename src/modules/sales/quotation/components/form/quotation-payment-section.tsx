// ============================================================
// components/sales/quotation/form/quotation-payment-section.tsx
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
import { Textarea } from "@/components/ui/textarea";
import type { QuotationFormValues } from "./quotation.schema";

export function QuotationPaymentSection() {
  const { register } = useFormContext<QuotationFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payment & Bank Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Input
            placeholder="e.g. Net 30 / Due on receipt"
            {...register("paymentTerms")}
          />
        </div>

        <div className="space-y-2">
          <Label>Bank Name</Label>
          <Input {...register("bankName")} placeholder="Bank name" />
        </div>

        <div className="space-y-2">
          <Label>Account Number</Label>
          <Input {...register("accountNumber")} placeholder="Account number" />
        </div>

        <div className="space-y-2">
          <Label>IFSC Code</Label>
          <Input {...register("ifsc")} placeholder="IFSC" />
        </div>

        <div className="space-y-2">
          <Label>UPI ID</Label>
          <Input {...register("upiId")} placeholder="yourname@upi" />
        </div>

        <div className="space-y-2">
          <Label>Payment Instructions</Label>
          <Textarea
            rows={3}
            placeholder="Any special payment instructions..."
            {...register("paymentInstructions")}
          />
        </div>
      </CardContent>
    </Card>
  );
}