"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuotationFormValues } from "../../types/quotation-form.types";

const CURRENCIES = [
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "AED", label: "UAE Dirham (د.إ)" },
  { value: "SGD", label: "Singapore Dollar (S$)" },
];

export function QuotationDetailsSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const currency = watch("currency");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Details</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <Label htmlFor="validUntil">
              Valid Until <span className="text-destructive">*</span>
            </Label>

            <Input
              id="validUntil"
              type="date"
              {...register("validUntil")}
            />

            {errors.validUntil && (
              <p className="text-xs text-destructive">
                {errors.validUntil.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>

            <Select
              value={currency || "INR"}
              onValueChange={(value) =>
                setValue("currency", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>

              <SelectContent>
                {CURRENCIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}