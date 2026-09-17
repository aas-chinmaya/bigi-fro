"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import { QuotationItemRow } from "./quotation-item-row";

export function QuotationItemsSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold tracking-tight">
            Items
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search & add products or services
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              itemId: null,
              itemName: "",
              description: null,
              quantity: 1,
              unit: "NOS",
              rate: 0,
              discount: 0,
              discountType: "PERCENTAGE",
              taxRate: 18,
              taxAmount: 0,
              amount: 0,
            })
          }
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Item
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {errors.items && typeof errors.items.message === "string" && (
          <p className="text-xs text-destructive">{errors.items.message}</p>
        )}

        <div className="hidden md:grid grid-cols-12 gap-3 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <div className="col-span-4">Item</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-2">Tax %</div>
          <div className="col-span-1">Unit</div>
          <div className="col-span-1" />
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