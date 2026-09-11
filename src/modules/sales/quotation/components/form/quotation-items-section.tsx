// ============================================================
// components/sales/quotation/form/quotation-items-section.tsx
// ============================================================

"use client";

import { UseFieldArrayReturn } from "react-hook-form";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuotationItemRow } from "./quotation-item-row";
import type { QuotationFormValues } from "./quotation.schema";

interface Props {
  fields: UseFieldArrayReturn<QuotationFormValues, "items">["fields"];
  append: UseFieldArrayReturn<QuotationFormValues, "items">["append"];
  remove: UseFieldArrayReturn<QuotationFormValues, "items">["remove"];
}

export function QuotationItemsSection({ fields, append, remove }: Props) {
  const handleAddItem = () => {
    append({
      name: "",
      description: "",
      quantity: 1,
      unit: "pcs",
      rate: 0,
      discountType: "percentage",
      discountValue: 0,
      taxRate: 0,
      taxAmount: 0,
      amount: 0,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Items</CardTitle>
        <Button type="button" size="sm" variant="outline" onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="hidden grid-cols-12 gap-2 text-xs font-medium text-muted-foreground md:grid">
          <div className="col-span-4">Item / Description</div>
          <div className="col-span-1 text-right">Qty</div>
          <div className="col-span-1">Unit</div>
          <div className="col-span-1 text-right">Rate</div>
          <div className="col-span-2 text-right">Discount</div>
          <div className="col-span-1 text-right">Tax %</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-1"></div>
        </div>

        {fields.map((field, index) => (
          <QuotationItemRow
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}