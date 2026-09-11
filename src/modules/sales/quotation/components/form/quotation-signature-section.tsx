// ============================================================
// components/sales/quotation/form/quotation-signature-section.tsx
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
import type { QuotationFormValues } from "./quotation.schema";

export function QuotationSignatureSection() {
  const { register } = useFormContext<QuotationFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Authorized Signature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Authorized Person</Label>
          <Input
            placeholder="Full name"
            {...register("authorizedPerson")}
          />
        </div>

        <div className="space-y-2">
          <Label>Designation</Label>
          <Input
            placeholder="e.g. Managing Director"
            {...register("designation")}
          />
        </div>

        {/* Later you can add signature upload / digital signature here */}
        <div className="space-y-2">
          <Label>Signature URL (optional)</Label>
          <Input
            placeholder="https://..."
            {...register("signatureUrl")}
          />
        </div>
      </CardContent>
    </Card>
  );
}