// ============================================================
// components/sales/quotation/form/quotation-details-section.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuotationFormValues } from "./quotation.schema";

export function QuotationDetailsSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quotation Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="quotationDate">
              Quotation Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quotationDate"
              type="date"
              {...register("quotationDate")}
            />
            {errors.quotationDate && (
              <p className="text-xs text-destructive">
                {errors.quotationDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input id="validUntil" type="date" {...register("validUntil")} />
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={watch("currency")}
              onValueChange={(val) => setValue("currency", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              placeholder="Optional reference"
              {...register("referenceNumber")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes (visible to customer)</Label>
            <Input
              id="notes"
              placeholder="Any notes for the customer..."
              {...register("notes")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}