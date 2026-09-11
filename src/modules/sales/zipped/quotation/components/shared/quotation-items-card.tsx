"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FormError from "@/components/form/FormError";
import { QuotationItemRow } from "./quotation-item-row";
import type { UseFieldArrayReturn } from "react-hook-form";
import type { QuotationFormValues } from "../../schema/quotation.schema";

interface QuotationItemsCardProps {
  itemsArray: UseFieldArrayReturn<QuotationFormValues, "items">;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  rootError?: string;
}

export function QuotationItemsCard({
  itemsArray,
  onAddItem,
  onRemoveItem,
  rootError,
}: QuotationItemsCardProps) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Items</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="w-10 pb-2">#</th>
              <th className="pb-2">Product</th>
              <th className="w-24 pb-2">Qty</th>
              <th className="w-28 pb-2">Rate</th>
              <th className="w-36 pb-2">Discount</th>
              <th className="w-20 pb-2">Tax %</th>
              <th className="w-32 pb-2 text-right">Amount</th>
              <th className="w-10 pb-2" />
            </tr>
          </thead>
          <tbody>
            {itemsArray.fields.map((field, index) => (
              <QuotationItemRow
                key={field.id}
                index={index}
                onRemove={() => onRemoveItem(index)}
                canRemove={itemsArray.fields.length > 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {itemsArray.fields.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-400">
          No items yet — click &ldquo;Add Item&rdquo; to get started.
        </p>
      )}

      <FormError message={rootError} />
    </Card>
  );
}
