




"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  BadgeIndianRupee,
  Minus,
  PackagePlus,
  Percent,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceItems } from "@/modules/items/hooks/useInvoiceItems";
import type {
  InvoiceItemFormValues,
  InvoiceFormValues,
} from "../../types/invoice-form.types";

const EMPTY_ITEMS: InvoiceItemFormValues[] = [];
const number = (value: unknown) => Math.max(0, Number(value) || 0);

/**
 * Desktop grid (no actions column — buttons live in row 2 of product cell)
 * Product ≈ 1/3, remaining columns share the rest → no blank gaps
 */
const DESKTOP_GRID =
  "lg:grid-cols-[28px_minmax(160px,33%)_minmax(52px,0.6fr)_minmax(56px,0.6fr)_minmax(80px,0.85fr)_minmax(110px,1.1fr)_minmax(68px,0.7fr)_minmax(84px,0.85fr)] lg:gap-2";

const newLineItem = (): InvoiceItemFormValues => ({
  productId: "",
  productName: "",
  unit: "NOS",
  hsnSacCode: "NA",
  itemCode: "",
  classification: "GOODS",
  quantity: 1,
  rate: 0,
  discountType: "percentage",
  discountValue: 0,
  taxableAmount: 0,
  cgst: 0,
  sgst: 0,
  igst: 0,
  cess: 0,
  grandTotal: 0,
  description: "",
});

function lineTotals(item: InvoiceItemFormValues) {
  const subtotal = number(item.quantity) * number(item.rate);
  const discount =
    item.discountType === "fixed"
      ? Math.min(number(item.discountValue), subtotal)
      : Math.min((subtotal * number(item.discountValue)) / 100, subtotal);
  const taxable = subtotal - discount;
  const tax = number(item.igst);
  return { subtotal, discount, tax, total: taxable + tax };
}

export default function InvoiceItemsCard() {
  const { items: catalog, loading } = useInvoiceItems();

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({ control, name: "items" }) ?? EMPTY_ITEMS;

  useEffect(() => {
    if (!fields.length) replace([newLineItem()]);
  }, [fields.length, replace]);

  const totals = useMemo(
    () =>
      items.reduce(
        (result, item) => {
          const line = lineTotals(item);
          return {
            quantity: result.quantity + number(item.quantity),
            subtotal: result.subtotal + line.subtotal,
            discount: result.discount + line.discount,
            tax: result.tax + line.tax,
            total: result.total + line.total,
          };
        },
        { quantity: 0, subtotal: 0, discount: 0, tax: 0, total: 0 }
      ),
    [items]
  );

  const updateLine = (index: number, patch: Partial<InvoiceItemFormValues>) => {
    const current = {
      ...getValues(`items.${index}`),
      ...patch,
    } as InvoiceItemFormValues;

    const qty = number(current.quantity);
    const rate = number(current.rate);
    const subtotal = qty * rate;
    const discountValue = number(current.discountValue);
    const discountAmount =
      current.discountType === "fixed"
        ? Math.min(discountValue, subtotal)
        : Math.min((subtotal * discountValue) / 100, subtotal);
    const taxable = Number((subtotal - discountAmount).toFixed(2));

    const taxAmount = number(current.igst);
    const grandTotal = Number((taxable + taxAmount).toFixed(2));

    const next: InvoiceItemFormValues = {
      ...current,
      taxableAmount: taxable,
      cgst: 0,
      sgst: 0,
      igst: taxAmount,
      cess: 0,
      grandTotal,
    };

    Object.entries(next).forEach(([key, value]) =>
      setValue(`items.${index}.${key}` as never, value as never, {
        shouldDirty: true,
        shouldValidate: true,
      })
    );
  };

  const selectItem = (index: number, itemId: string) => {
    const selected = catalog.find((entry) => entry.id === itemId);
    if (!selected) return;

    const gstRate =
      number(selected.gstRate) || number(selected.tax?.gstRate) || 0;
    const rate = number(selected.salePrice);
    const taxAmount = Number(((rate * gstRate) / 100).toFixed(2));

    const rawDesc = selected.description ?? "";
    const plainDesc = rawDesc.replace(/<[^>]*>/g, "").trim();

    updateLine(index, {
      productId: selected.id,
      productName: selected.name ?? "",
      unit: selected.unit ?? "NOS",
      hsnSacCode: selected.hsnSacCode ?? "NA",
      itemCode: selected.itemCode ?? selected.id,
      classification:
        selected.classification === "SERVICES" ? "SERVICES" : "GOODS",
      rate,
      igst: taxAmount,
      discountValue: 0,
      discountType: "percentage",
      description: plainDesc,
    });
  };

  const removeLine = (index: number) => {
    if (fields.length === 1) replace([newLineItem()]);
    else remove(index);
  };

  return (
    <section className="min-w-0 space-y-3">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-md bg-sky-50 text-sky-600">
          <PackagePlus className="size-3.5" />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Invoice items</h2>
      </div>

      {typeof errors.items?.message === "string" && (
        <p className="text-xs text-red-600">{errors.items.message}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {/* Desktop header */}
        <div
          className={`hidden border-b bg-slate-50/80 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:grid ${DESKTOP_GRID}`}
        >
          <div>#</div>
          <div>Product / service</div>
          <div className="text-center">Qty</div>
          <div className="text-center">UOM</div>
          <div className="text-right">Price</div>
          <div className="text-right">Discount</div>
          <div className="text-right">Tax</div>
          <div className="text-right">Total</div>
        </div>

        <div className="divide-y divide-gray-100">
          {fields.map((field, index) => {
            const item = items[index] ?? newLineItem();
            const total = lineTotals(item);
            const itemError = errors.items?.[index];

            return (
              <div
                key={field.id}
                className={`grid grid-cols-1 gap-3 px-3 py-3 sm:gap-2 lg:items-start ${DESKTOP_GRID}`}
              >
                {/* # */}
                <div className="hidden pt-2 text-xs text-slate-400 lg:block">
                  {index + 1}
                </div>

                {/* Product + note + actions (row 2) */}
                <div className="min-w-0 space-y-2">
                  <ItemPicker
                    value={item.productId}
                    loading={loading}
                    items={catalog}
                    onSelect={(id) => selectItem(index, id)}
                  />

                  {/* Row 2: note + green/red buttons */}
                  <div className="flex items-start gap-2">
                    <textarea
                      value={item.description ?? ""}
                      onChange={(e) =>
                        updateLine(index, { description: e.target.value })
                      }
                      placeholder="Item note..."
                      rows={2}
                      className="min-w-0 flex-1 resize-none rounded-md border border-amber-100 bg-amber-50/60 px-2.5 py-1.5 text-xs text-slate-700 outline-none placeholder:text-amber-800/40 focus:border-amber-200 focus:ring-1 focus:ring-amber-100"
                    />

                  </div>

                  {itemError?.productId && (
                    <p className="text-xs text-red-600">
                      {itemError.productId.message}
                    </p>
                  )}
                </div>

                {/* Qty */}
                <div>
                  <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                    Qty
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLine(index, { quantity: number(e.target.value) })
                    }
                    className="h-9 text-center"
                  />
                </div>

                {/* UOM — readonly */}
                <div>
                  <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                    UOM
                  </span>
                  <Input
                    value={item.unit ?? ""}
                    readOnly
                    className="h-9 cursor-default bg-slate-50 text-center text-xs font-medium uppercase text-slate-600"
                  />
                </div>

                {/* Price */}
                <div>
                  <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                    Price
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={item.rate}
                    onChange={(e) =>
                      updateLine(index, { rate: number(e.target.value) })
                    }
                    className="h-9 text-right"
                  />
                </div>

                {/* Discount */}
                <div>
                  <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                    Discount
                  </span>
                  <div className="flex h-9 overflow-hidden rounded-md border border-input">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={item.discountValue ?? 0}
                      onChange={(e) =>
                        updateLine(index, {
                          discountValue: number(e.target.value),
                        })
                      }
                      className="h-full min-w-0 flex-1 rounded-none border-0 px-2 text-right focus-visible:ring-0"
                    />
                    <Select
                      value={item.discountType ?? "percentage"}
                      onValueChange={(value) =>
                        updateLine(index, {
                          discountType: value as "percentage" | "fixed",
                        })
                      }
                    >
                      <SelectTrigger className="h-full w-11 shrink-0 rounded-none border-0 border-l bg-slate-50 px-1 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <span className="flex items-center gap-1 text-xs">
                            <Percent className="size-3" /> %
                          </span>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <span className="flex items-center gap-1 text-xs">
                            <BadgeIndianRupee className="size-3" /> ₹
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tax — readonly */}
                <div>
                  <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                    Tax
                  </span>
                  <Input
                    type="number"
                    value={number(item.igst).toFixed(2)}
                    readOnly
                    className="h-9 cursor-default bg-slate-50 text-right text-slate-600"
                  />
                </div>

                {/* Total */}
             
                <div className="flex flex-col items-end gap-1.5 lg:pt-2">
  <span className="text-[10px] font-medium uppercase text-slate-400 lg:hidden">
    Total
  </span>

  <div className="text-right text-sm font-semibold tabular-nums text-slate-900">
    ₹{total.total.toFixed(2)}
  </div>

  <div className="flex justify-end gap-1.5">
    <Button
      type="button"
      size="icon"
      aria-label="Add item"
      onClick={() => append(newLineItem())}
      className="size-8 cursor-pointer border-0 bg-primary p-2 text-white shadow-none "
    >
      <Plus className="size-4" />
    </Button>

    <Button
      type="button"
      size="icon"
      aria-label="Remove item"
      onClick={() => removeLine(index)}
      className="size-8 cursor-pointer border-0 bg-red-500 p-2 text-white shadow-none hover:bg-red-500"
    >
      <Minus className="size-4" />
    </Button>
  </div>
</div>
              </div>
            );
          })}
        </div>

       
        {/* Footer — responsive */}
<div className="border-t border-amber-100 bg-amber-50/90 px-3 py-3 text-sm font-semibold">
  {/* Desktop */}
  <div
    className={`hidden lg:grid lg:items-center ${DESKTOP_GRID}`}
  >
    <div className="col-span-2 text-slate-700">
      Total Inv. Val
    </div>

    <div className="text-center tabular-nums">
      {totals.quantity}
    </div>

    <div />

    <div className="text-right tabular-nums">
      ₹{totals.subtotal.toFixed(2)}
    </div>

    <div className="text-right tabular-nums">
      ₹{totals.discount.toFixed(2)}
    </div>

    <div className="text-right tabular-nums">
      ₹{totals.tax.toFixed(2)}
    </div>

    <div className="text-right tabular-nums text-slate-900">
      ₹{totals.total.toFixed(2)}
    </div>
  </div>

  {/* Mobile / Tablet */}
  <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:hidden">
    <div className="text-slate-700">
      Total Inv. Val
    </div>

    <div className="text-right tabular-nums text-slate-900">
      ₹{totals.total.toFixed(2)}
    </div>

    <div className="text-xs font-medium text-slate-500">
      Quantity
    </div>

    <div className="text-right tabular-nums">
      {totals.quantity}
    </div>

    <div className="text-xs font-medium text-slate-500">
      Subtotal
    </div>

    <div className="text-right tabular-nums">
      ₹{totals.subtotal.toFixed(2)}
    </div>

    <div className="text-xs font-medium text-slate-500">
      Discount
    </div>

    <div className="text-right tabular-nums">
      ₹{totals.discount.toFixed(2)}
    </div>

    <div className="text-xs font-medium text-slate-500">
      Tax
    </div>

    <div className="text-right tabular-nums">
      ₹{totals.tax.toFixed(2)}
    </div>
  </div>
</div>
      </div>
    </section>
  );
}

type CatalogItem = {
  id: string;
  name?: string;
  type?: "PRODUCT" | "SERVICE";
  classification?: "GOODS" | "SERVICES";
  itemCode?: string;
  salePrice?: number;
  unit?: string;
  hsnSacCode?: string;
  gstRate?: number;
  tax?: { gstRate?: number };
  categoryName?: string;
  brandName?: string;
  description?: string;
};

function ItemPicker({
  value,
  items,
  loading,
  onSelect,
}: {
  value: string;
  items: CatalogItem[];
  loading: boolean;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = items.find((item) => item.id === value);

  const matches = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      (item.name ?? "").toLowerCase().includes(q) ||
      (item.itemCode ?? "").toLowerCase().includes(q) ||
      (item.categoryName ?? "").toLowerCase().includes(q) ||
      (item.type ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 w-full justify-between px-2.5 font-normal"
        >
          <span className="min-w-0 flex-1 truncate text-left text-sm">
            {selected ? (
              <span className="flex items-center gap-1.5">
                <span
                  className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                    selected.type === "SERVICE"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {selected.type === "SERVICE" ? "SRV" : "PRD"}
                </span>
                <span className="truncate">{selected.name}</span>
              </span>
            ) : loading ? (
              "Loading..."
            ) : (
              "Enter product / service"
            )}
          </span>
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] p-1.5"
      >
        <div className="relative mb-1.5">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Search name or code..."
            className="h-8 pl-8 text-sm"
          />
        </div>

        <div className="max-h-52 overflow-y-auto">
          {matches.length ? (
            matches.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => {
                  onSelect(item.id);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex-col items-start gap-0.5 py-1.5"
              >
                <div className="flex w-full items-center gap-1.5">
                  <span
                    className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                      item.type === "SERVICE"
                        ? "bg-violet-50 text-violet-700"
                        : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {item.type === "SERVICE" ? "SRV" : "PRD"}
                  </span>
                  <span className="truncate text-sm font-medium">
                    {item.name ?? "Unnamed"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-1.5 text-[11px] text-muted-foreground">
                  {item.itemCode && <span>{item.itemCode}</span>}
                  {item.unit && <span>· {item.unit}</span>}
                  {item.salePrice != null && item.salePrice > 0 && (
                    <span>· ₹{item.salePrice}</span>
                  )}
                  <span>
                    · {number(item.gstRate) || number(item.tax?.gstRate) || 0}%
                    GST
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              No items found
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}