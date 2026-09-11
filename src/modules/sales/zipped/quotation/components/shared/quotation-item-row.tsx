"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormError from "@/components/form/FormError";
import { QuotationSearchableSelect } from "./quotation-searchable-select";
import { useProductOptions } from "../../hooks/use-product-options";
import { calculateLineItem } from "../../lib/calculations";
import { formatCurrency } from "../../lib/format";
import type { QuotationFormValues } from "../../schema/quotation.schema";

interface QuotationItemRowProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuotationItemRow({ index, onRemove, canRemove }: QuotationItemRowProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const { options: productOptions, loading, setSearch, getProductById } = useProductOptions();

  const item = watch(`items.${index}`);
  const itemErrors = errors.items?.[index];

  const totals = calculateLineItem({
    quantity: Number(item?.quantity) || 0,
    rate: Number(item?.rate) || 0,
    discountType: item?.discountType || "PERCENTAGE",
    discountValue: Number(item?.discountValue) || 0,
    taxRate: Number(item?.taxRate) || 0,
  });

  const handleSelectProduct = (productId: string) => {
    const product = getProductById(productId);

    setValue(`items.${index}.productId`, productId, { shouldValidate: true });
    setValue(`items.${index}.productName`, product?.label || "", { shouldValidate: true });
    setValue(`items.${index}.unit`, product?.unit || "");
    setValue(`items.${index}.rate`, product?.rate ?? 0, { shouldValidate: true });
    setValue(`items.${index}.taxRate`, product?.taxRate ?? 0);
  };

  return (
    <tr className="border-b border-gray-100 align-top last:border-0">
      <td className="w-10 py-3 pr-2 text-sm text-gray-400">{index + 1}</td>

      <td className="min-w-[220px] py-3 pr-3">
        <Controller
          control={control}
          name={`items.${index}.productId`}
          render={({ field }) => (
            <QuotationSearchableSelect
              value={field.value}
              onChange={handleSelectProduct}
              options={productOptions}
              loading={loading}
              placeholder="Select product"
              onSearch={setSearch}
            />
          )}
        />
        <FormError message={itemErrors?.productId?.message as string | undefined} />

        <Controller
          control={control}
          name={`items.${index}.description`}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Description (optional)"
              className="mt-2 h-8 text-xs"
            />
          )}
        />
      </td>

      <td className="w-24 py-3 pr-3">
        <Controller
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={0}
              step="any"
              className="h-9"
              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
            />
          )}
        />
        <FormError message={itemErrors?.quantity?.message} />
      </td>

      <td className="w-28 py-3 pr-3">
        <Controller
          control={control}
          name={`items.${index}.rate`}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={0}
              step="any"
              className="h-9"
              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
            />
          )}
        />
        <FormError message={itemErrors?.rate?.message} />
      </td>

      <td className="w-36 py-3 pr-3">
        <div className="flex gap-1.5">
          <Controller
            control={control}
            name={`items.${index}.discountValue`}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min={0}
                step="any"
                className="h-9"
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
            )}
          />
          <Controller
            control={control}
            name={`items.${index}.discountType`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 w-14 px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">%</SelectItem>
                  <SelectItem value="FIXED">₹</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <FormError message={itemErrors?.discountValue?.message} />
      </td>

      <td className="w-20 py-3 pr-3">
        <Controller
          control={control}
          name={`items.${index}.taxRate`}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={0}
              max={100}
              step="any"
              className="h-9"
              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
            />
          )}
        />
      </td>

      <td className="w-32 py-3 pr-3 text-right text-sm font-medium text-gray-900">
        {formatCurrency(totals.amount)}
      </td>

      <td className="w-10 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canRemove}
          onClick={onRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </td>
    </tr>
  );
}
