

"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import type { TaxType } from "../../types/quotation.types";
import { calcLine, formatINR } from "../../utils/quotation-form.utils";
import ItemSearchSelect, {
  type SelectedItem,
} from "@/modules/sales/shared/components/item-search-select";

interface Props {
  index: number;
  onRemove: () => void;
  onAdd: () => void;
  canRemove: boolean;
  taxType: TaxType;
}

export function QuotationItemRow({
  index,
  onRemove,
  onAdd,
  canRemove,
  taxType,
}: Props) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const itemErrors = errors.items?.[index];
  const isInter = taxType === "INTER_STATE";

  const quantity = useWatch({ control, name: `items.${index}.quantity` }) ?? 0;
  const rate = useWatch({ control, name: `items.${index}.rate` }) ?? 0;
  const price = useWatch({ control, name: `items.${index}.price` });
  const discount = useWatch({ control, name: `items.${index}.discount` }) ?? 0;
  const discountType =
    useWatch({ control, name: `items.${index}.discountType` }) ?? "PERCENTAGE";
  const taxRate = useWatch({ control, name: `items.${index}.taxRate` }) ?? 0;
  const itemName = useWatch({ control, name: `items.${index}.itemName` }) ?? "";
  const unit = useWatch({ control, name: `items.${index}.unit` }) ?? "PCS";
  const description =
    useWatch({ control, name: `items.${index}.description` }) ?? "";

  const unitPrice =
    price != null && Number(price) > 0 ? Number(price) : Number(rate) || 0;

  const line = useMemo(
    () =>
      calcLine(
        {
          quantity,
          rate: unitPrice,
          price: unitPrice,
          discount,
          discountType,
          taxRate,
        },
        taxType,
      ),
    [quantity, unitPrice, discount, discountType, taxRate, taxType],
  );

  const applyItem = (item: SelectedItem | null) => {
    if (!item) {
      setValue(`items.${index}.itemId`, null, { shouldDirty: true });
      return;
    }
    setValue(`items.${index}.itemId`, item.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`items.${index}.itemName`, item.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`items.${index}.description`, item.description ?? null, {
      shouldDirty: true,
    });
    setValue(`items.${index}.rate`, item.rate, { shouldDirty: true });
    setValue(`items.${index}.price`, item.rate, { shouldDirty: true });
    setValue(`items.${index}.unit`, item.unit, { shouldDirty: true });
    setValue(`items.${index}.taxRate`, item.taxRate, { shouldDirty: true });
    if (item.hsnSac != null) {
      setValue(`items.${index}.hsnSac`, item.hsnSac, { shouldDirty: true });
    }
    if (!quantity) {
      setValue(`items.${index}.quantity`, 1, { shouldDirty: true });
    }
  };

  return (
    <tr className="group border-b border-slate-100 align-top hover:bg-slate-50/40">
      <td className="px-2 py-2 text-center text-xs text-slate-400">
        {index + 1}
      </td>

      <td className="relative z-10 overflow-visible px-2 py-2">
        <div className="relative z-10 min-w-[260px] space-y-1.5">
          <ItemSearchSelect
            label=""
            value={itemName}
            onSelect={applyItem}
            onQueryChange={(q) =>
              setValue(`items.${index}.itemName`, q, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Search inventory item"
          />

          <textarea
            placeholder="Description / note"
            rows={2}
            value={description || ""}
            onChange={(e) =>
              setValue(`items.${index}.description`, e.target.value || null, {
                shouldDirty: true,
              })
            }
            className="w-full resize-none rounded-md border border-amber-100 bg-amber-50/80 px-2 py-1.5 text-xs leading-snug text-slate-600 placeholder:text-slate-400 focus:border-amber-200 focus:outline-none"
          />

          {itemErrors?.itemName && (
            <p className="text-[11px] text-red-500">
              {itemErrors.itemName.message}
            </p>
          )}
        </div>
      </td>

      <td className="px-2 py-2">
        <Input
          type="number"
          step="any"
          min={0}
          className="h-9 text-center tabular-nums"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
        />
      </td>

      <td className="px-2 py-2">
        <Input
          readOnly
          value={unit || "PCS"}
          className="h-9 cursor-default bg-slate-50 text-center text-xs uppercase text-slate-600"
          tabIndex={-1}
        />
      </td>

      <td className="px-2 py-2">
        <Input
          type="number"
          step="any"
          min={0}
          className="h-9 text-right tabular-nums"
          value={unitPrice || ""}
          onChange={(e) => {
            const v = e.target.value === "" ? 0 : Number(e.target.value);
            setValue(`items.${index}.rate`, v, { shouldDirty: true });
            setValue(`items.${index}.price`, v, { shouldDirty: true });
          }}
        />
      </td>

      <td className="px-2 py-2">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            step="any"
            min={0}
            className="h-9 min-w-0 flex-1 text-center tabular-nums"
            {...register(`items.${index}.discount`, { valueAsNumber: true })}
          />
          <button
            type="button"
            title="Toggle % / ₹"
            onClick={() =>
              setValue(
                `items.${index}.discountType`,
                discountType === "PERCENTAGE" ? "FIXED" : "PERCENTAGE",
                { shouldDirty: true },
              )
            }
            className="h-9 w-8 shrink-0 rounded-md border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            {discountType === "PERCENTAGE" ? "%" : "₹"}
          </button>
        </div>
      </td>

      {isInter ? (
        <td className="px-2 py-2">
          <Input
            type="number"
            step="any"
            min={0}
            className="h-9 text-center tabular-nums"
            {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
          />
          <p className="mt-0.5 text-center text-[10px] tabular-nums text-slate-400">
            {formatINR(line.igstAmount)}
          </p>
        </td>
      ) : (
        <>
          <td className="px-2 py-2 text-center">
            <span className="text-xs tabular-nums text-slate-600">
              {line.cgstRate}%
            </span>
            <p className="text-[10px] tabular-nums text-slate-400">
              {formatINR(line.cgstAmount)}
            </p>
          </td>
          <td className="px-2 py-2 text-center">
            <span className="text-xs tabular-nums text-slate-600">
              {line.sgstRate}%
            </span>
            <p className="text-[10px] tabular-nums text-slate-400">
              {formatINR(line.sgstAmount)}
            </p>
          </td>
        </>
      )}

      <td className="px-2 py-2 text-right">
        <span className="text-sm font-medium tabular-nums text-slate-900">
          {formatINR(line.total)}
        </span>
      </td>

      <td className="px-1 py-2">
        <div className="flex items-center justify-center gap-0.5">
     
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onAdd}
                  className="h-8 w-8 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  disabled={!canRemove}
                  className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
     
        </div>
      </td>
    </tr>
  );
}