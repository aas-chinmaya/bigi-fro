// ============================================================
// components/sales/quotation/form/quotation-item-row.tsx
// ============================================================

"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuotationFormValues } from "./quotation.schema";

interface Props {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuotationItemRow({ index, onRemove, canRemove }: Props) {
  const { register, setValue, control } = useFormContext<QuotationFormValues>();

  const quantity = useWatch({ control, name: `items.${index}.quantity` }) || 0;
  const rate = useWatch({ control, name: `items.${index}.rate` }) || 0;
  const discountType =
    useWatch({ control, name: `items.${index}.discountType` }) || "percentage";
  const discountValue =
    useWatch({ control, name: `items.${index}.discountValue` }) || 0;
  const taxRate = useWatch({ control, name: `items.${index}.taxRate` }) || 0;

  // Calculate line amount
  const lineGross = Number(quantity) * Number(rate);
  let lineDiscount = 0;
  if (discountType === "percentage") {
    lineDiscount = (lineGross * Number(discountValue)) / 100;
  } else {
    lineDiscount = Number(discountValue);
  }
  const taxable = lineGross - lineDiscount;
  const lineTax = (taxable * Number(taxRate)) / 100;
  const lineAmount = taxable + lineTax;

  // Keep amount in sync
  setValue(`items.${index}.amount`, Number(lineAmount.toFixed(2)), {
    shouldDirty: false,
  });
  setValue(`items.${index}.taxAmount`, Number(lineTax.toFixed(2)), {
    shouldDirty: false,
  });

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-12 md:items-start md:gap-2 md:border-0 md:p-0">
      {/* Name + Description */}
      <div className="space-y-1 md:col-span-4">
        <Input
          placeholder="Item name *"
          {...register(`items.${index}.name`)}
        />
        <Input
          placeholder="Description (optional)"
          className="text-xs"
          {...register(`items.${index}.description`)}
        />
      </div>

      {/* Quantity */}
      <div className="md:col-span-1">
        <Input
          type="number"
          step="any"
          className="text-right"
          {...register(`items.${index}.quantity`)}
        />
      </div>

      {/* Unit */}
      <div className="md:col-span-1">
        <Input placeholder="pcs" {...register(`items.${index}.unit`)} />
      </div>

      {/* Rate */}
      <div className="md:col-span-1">
        <Input
          type="number"
          step="any"
          className="text-right"
          {...register(`items.${index}.rate`)}
        />
      </div>

      {/* Discount */}
      <div className="flex gap-1 md:col-span-2">
        <Select
          value={discountType}
          onValueChange={(val) =>
            setValue(`items.${index}.discountType`, val as "percentage" | "fixed")
          }
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">%</SelectItem>
            <SelectItem value="fixed">₹</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          step="any"
          className="text-right"
          {...register(`items.${index}.discountValue`)}
        />
      </div>

      {/* Tax % */}
      <div className="md:col-span-1">
        <Input
          type="number"
          step="any"
          className="text-right"
          placeholder="0"
          {...register(`items.${index}.taxRate`)}
        />
      </div>

      {/* Amount */}
      <div className="md:col-span-1">
        <Input
          readOnly
          className="bg-muted text-right font-medium"
          value={lineAmount.toFixed(2)}
        />
      </div>

      {/* Remove */}
      <div className="flex justify-end md:col-span-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}