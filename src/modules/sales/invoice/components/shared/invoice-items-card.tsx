

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
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

/* =========================================================
   TYPES
========================================================= */

type CatalogItem = {
  id: string;
  name?: string;
  description?: string;

  type?: "PRODUCT" | "SERVICE";
  classification?: "GOODS" | "SERVICES";

  itemCode?: string;
  salePrice?: number;

  unit?: string;
  hsnSacCode?: string;

  gstRate?: number;

  tax?: {
    gstRate?: number;
    rate?: number;
    taxRate?: number;
    percentage?: number;
    taxPercentage?: number;
    value?: number;
  };

  categoryName?: string;
  brandName?: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const EMPTY_ITEMS: InvoiceItemFormValues[] = [];

const DESKTOP_GRID =
  "lg:grid-cols-[28px_minmax(160px,33%)_minmax(52px,0.6fr)_minmax(56px,0.6fr)_minmax(80px,0.85fr)_minmax(110px,1.1fr)_minmax(68px,0.7fr)_minmax(84px,0.85fr)] lg:gap-2";

/* =========================================================
   HELPERS
========================================================= */

const number = (value: unknown): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, parsed);
};

const createEmptyItem = (): InvoiceItemFormValues => ({
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

/* =========================================================
   TAX HELPER
========================================================= */

const getTaxRate = (tax: any): number => {
  if (tax == null) {
    return 0;
  }

  if (typeof tax === "number") {
    return number(tax);
  }

  if (typeof tax === "string") {
    return number(tax);
  }

  if (typeof tax === "object") {
    return number(
      tax.gstRate ??
        tax.rate ??
        tax.taxRate ??
        tax.percentage ??
        tax.taxPercentage ??
        tax.value ??
        0
    );
  }

  return 0;
};

/* =========================================================
   DESCRIPTION CLEANER
========================================================= */

const cleanDescription = (value: unknown): string => {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/<[^>]*>/g, "")
    .trim();
};

/* =========================================================
   LINE CALCULATION
========================================================= */

function lineTotals(item: InvoiceItemFormValues) {
  const quantity = number(item.quantity);
  const rate = number(item.rate);

  const subtotal = quantity * rate;

  const discountValue = number(item.discountValue);

  const discount =
    item.discountType === "fixed"
      ? Math.min(discountValue, subtotal)
      : Math.min(
          (subtotal * discountValue) / 100,
          subtotal
        );

  const taxable = Math.max(
    subtotal - discount,
    0
  );

  const tax = number(item.igst);

  const total = taxable + tax;

  return {
    subtotal,
    discount,
    taxable,
    tax,
    total,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function InvoiceItemsCard() {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove, replace } =
    useFieldArray({
      control,
      name: "items",
    });

  const {
    items: catalog,
    loading,
    error,
  } = useInvoiceItems();

  const items =
    useWatch({
      control,
      name: "items",
    }) ?? EMPTY_ITEMS;

  /* =======================================================
     ENSURE ONE EMPTY ROW
  ======================================================= */

  useEffect(() => {
    if (!fields.length) {
      replace([createEmptyItem()]);
    }
  }, [fields.length, replace]);

  /* =======================================================
     TOTALS
  ======================================================= */

  const totals = useMemo(() => {
    return items.reduce(
      (result, item) => {
        if (!item) {
          return result;
        }

        const line = lineTotals(item);

        return {
          quantity:
            result.quantity +
            number(item.quantity),

          subtotal:
            result.subtotal +
            line.subtotal,

          discount:
            result.discount +
            line.discount,

          tax:
            result.tax +
            line.tax,

          total:
            result.total +
            line.total,
        };
      },
      {
        quantity: 0,
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
      }
    );
  }, [items]);

  /* =======================================================
     UPDATE LINE
  ======================================================= */

  const updateLine = (
    index: number,
    patch: Partial<InvoiceItemFormValues>
  ) => {
    const current = {
      ...getValues(`items.${index}`),
      ...patch,
    } as InvoiceItemFormValues;

    const quantity = number(
      current.quantity
    );

    const rate = number(current.rate);

    const subtotal =
      quantity * rate;

    const discountValue = number(
      current.discountValue
    );

    const discountAmount =
      current.discountType === "fixed"
        ? Math.min(
            discountValue,
            subtotal
          )
        : Math.min(
            (subtotal * discountValue) /
              100,
            subtotal
          );

    const taxable = Math.max(
      subtotal - discountAmount,
      0
    );

    const taxAmount = number(
      current.igst
    );

    const grandTotal =
      taxable + taxAmount;

    const next: InvoiceItemFormValues = {
      ...current,

      taxableAmount: Number(
        taxable.toFixed(2)
      ),

      cgst: 0,

      sgst: 0,

      igst: Number(
        taxAmount.toFixed(2)
      ),

      cess: 0,

      grandTotal: Number(
        grandTotal.toFixed(2)
      ),
    };

    Object.entries(next).forEach(
      ([key, value]) => {
        setValue(
          `items.${index}.${key}` as never,
          value as never,
          {
            shouldDirty: true,
            shouldValidate: true,
          }
        );
      }
    );
  };

  /* =======================================================
     SELECT PRODUCT / SERVICE
  ======================================================= */

  const selectItem = (
    index: number,
    itemId: string
  ) => {
    const selected = catalog.find(
      (entry: CatalogItem) =>
        String(entry.id) ===
        String(itemId)
    );

    if (!selected) {
      return;
    }

    /* ---------------------------------------------
       RATE
    --------------------------------------------- */

    const rate = number(
      selected.salePrice
    );

    /* ---------------------------------------------
       GST
    --------------------------------------------- */

    const gstRate =
      number(selected.gstRate) ||
      getTaxRate(selected.tax);

    /* ---------------------------------------------
       QUANTITY
    --------------------------------------------- */

    const quantity = 1;

    /* ---------------------------------------------
       DISCOUNT
    --------------------------------------------- */

    const discountValue = 0;

    const discountType:
      | "percentage"
      | "fixed" = "percentage";

    /* ---------------------------------------------
       CALCULATE
    --------------------------------------------- */

    const subtotal =
      quantity * rate;

    const taxableAmount =
      subtotal;

    const taxAmount =
      taxableAmount *
      (gstRate / 100);

    const grandTotal =
      taxableAmount + taxAmount;

    /* ---------------------------------------------
       DESCRIPTION
    --------------------------------------------- */

    const description =
      cleanDescription(
        selected.description
      );

    /* ---------------------------------------------
       POPULATE FORM
    --------------------------------------------- */

    const populatedItem: InvoiceItemFormValues =
      {
        productId:
          String(selected.id),

        productName:
          selected.name ?? "",

        description,

        itemCode:
          selected.itemCode ??
          String(selected.id),

        classification:
          selected.classification ===
          "SERVICES"
            ? "SERVICES"
            : "GOODS",

        unit:
          selected.unit ??
          "NOS",

        hsnSacCode:
          selected.hsnSacCode ??
          "NA",

        quantity,

        rate,

        gstRate,

        discountType,

        discountValue,

        taxableAmount:
          Number(
            taxableAmount.toFixed(2)
          ),

        cgst: 0,

        sgst: 0,

        igst:
          Number(
            taxAmount.toFixed(2)
          ),

        cess: 0,

        grandTotal:
          Number(
            grandTotal.toFixed(2)
          ),
      };

    /* ---------------------------------------------
       IMPORTANT:
       Write ALL fields into React Hook Form.
    --------------------------------------------- */

    Object.entries(
      populatedItem
    ).forEach(([key, value]) => {
      setValue(
        `items.${index}.${key}` as never,
        value as never,
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
    });
  };

  /* =======================================================
     REMOVE LINE
  ======================================================= */

  const removeLine = (
    index: number
  ) => {
    if (fields.length === 1) {
      replace([
        createEmptyItem(),
      ]);

      return;
    }

    remove(index);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="min-w-0 space-y-3">
      {/* ================================================
          HEADER
      ================================================= */}

      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-md bg-sky-50 text-sky-600">
          <PackagePlus className="size-3.5" />
        </span>

        <h2 className="text-sm font-semibold text-gray-900">
          Invoice items
        </h2>
      </div>

      {/* ================================================
          FORM ERROR
      ================================================= */}

      {typeof errors.items?.message ===
        "string" && (
        <p className="text-xs text-red-600">
          {errors.items.message}
        </p>
      )}

      {/* ================================================
          LOADING
      ================================================= */}

      {loading && (
        <p className="text-xs text-muted-foreground">
          Loading products and services...
        </p>
      )}

      {/* ================================================
          ERROR
      ================================================= */}

      {error && (
        <p className="text-xs text-red-600">
          Failed to load products/services.
        </p>
      )}

      {/* ================================================
          TABLE
      ================================================= */}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {/* DESKTOP HEADER */}

        <div
          className={`hidden border-b bg-slate-50/80 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:grid ${DESKTOP_GRID}`}
        >
          <div>#</div>

          <div>
            Product / service
          </div>

          <div className="text-center">
            Qty
          </div>

          <div className="text-center">
            UOM
          </div>

          <div className="text-right">
            Price
          </div>

          <div className="text-right">
            Discount
          </div>

          <div className="text-right">
            Tax
          </div>

          <div className="text-right">
            Total
          </div>
        </div>

        {/* ==============================================
            ROWS
        ============================================== */}

        <div className="divide-y divide-gray-100">
          {fields.map(
            (field, index) => {
              const item =
                items[index] ??
                createEmptyItem();

              const total =
                lineTotals(item);

              const itemError =
                errors.items?.[index];

              return (
                <div
                  key={field.id}
                  className={`grid grid-cols-1 gap-3 px-3 py-3 sm:gap-2 lg:items-start ${DESKTOP_GRID}`}
                >
                  {/* ==================================
                      NUMBER
                  ================================== */}

                  <div className="hidden pt-2 text-xs text-slate-400 lg:block">
                    {index + 1}
                  </div>

                  {/* ==================================
                      PRODUCT
                  ================================== */}

                  <div className="min-w-0 space-y-2">
                    <ItemPicker
                      value={
                        item.productId
                      }
                      loading={loading}
                      items={
                        catalog as CatalogItem[]
                      }
                      fallbackName={
                        item.productName
                      }
                      onSelect={(id) =>
                        selectItem(
                          index,
                          id
                        )
                      }
                    />

                    {/* DESCRIPTION */}

                    <div className="flex items-start gap-2">
                      <textarea
                        value={
                          item.description ??
                          ""
                        }
                        onChange={(event) =>
                          updateLine(
                            index,
                            {
                              description:
                                event.target
                                  .value,
                            }
                          )
                        }
                        placeholder="Item note..."
                        rows={2}
                        className="min-w-0 flex-1 resize-none rounded-md border border-amber-100 bg-amber-50/60 px-2.5 py-1.5 text-xs text-slate-700 outline-none placeholder:text-amber-800/40 focus:border-amber-200 focus:ring-1 focus:ring-amber-100"
                      />
                    </div>

                    {itemError?.productId && (
                      <p className="text-xs text-red-600">
                        {
                          itemError
                            .productId
                            .message
                        }
                      </p>
                    )}
                  </div>

                  {/* ==================================
                      QUANTITY
                  ================================== */}

                  <div>
                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                      Qty
                    </span>

                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        item.quantity
                      }
                      onChange={(event) =>
                        updateLine(
                          index,
                          {
                            quantity:
                              number(
                                event
                                  .target
                                  .value
                              ),
                          }
                        )
                      }
                      className="h-9 text-center"
                    />
                  </div>

                  {/* ==================================
                      UOM
                  ================================== */}

                  <div>
                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                      UOM
                    </span>

                    <Input
                      value={
                        item.unit ??
                        ""
                      }
                      readOnly
                      className="h-9 cursor-default bg-slate-50 text-center text-xs font-medium uppercase text-slate-600"
                    />
                  </div>

                  {/* ==================================
                      PRICE
                  ================================== */}

                  <div>
                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                      Price
                    </span>

                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        item.rate
                      }
                      onChange={(event) =>
                        updateLine(
                          index,
                          {
                            rate:
                              number(
                                event
                                  .target
                                  .value
                              ),
                          }
                        )
                      }
                      className="h-9 text-right"
                    />
                  </div>

                  {/* ==================================
                      DISCOUNT
                  ================================== */}

                  <div>
                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                      Discount
                    </span>

                    <div className="flex h-9 overflow-hidden rounded-md border border-input">
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        value={
                          item.discountValue ??
                          0
                        }
                        onChange={(event) =>
                          updateLine(
                            index,
                            {
                              discountValue:
                                number(
                                  event
                                    .target
                                    .value
                                ),
                            }
                          )
                        }
                        className="h-full min-w-0 flex-1 rounded-none border-0 px-2 text-right focus-visible:ring-0"
                      />

                      <Select
                        value={
                          item.discountType ??
                          "percentage"
                        }
                        onValueChange={(
                          value
                        ) =>
                          updateLine(
                            index,
                            {
                              discountType:
                                value as
                                  | "percentage"
                                  | "fixed",
                            }
                          )
                        }
                      >
                        <SelectTrigger className="h-full w-11 shrink-0 rounded-none border-0 border-l bg-slate-50 px-1 shadow-none">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="percentage">
                            <span className="flex items-center gap-1 text-xs">
                              <Percent className="size-3" />
                              %
                            </span>
                          </SelectItem>

                          <SelectItem value="fixed">
                            <span className="flex items-center gap-1 text-xs">
                              <BadgeIndianRupee className="size-3" />
                              ₹
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ==================================
                      TAX
                  ================================== */}

                  <div>
                    <span className="mb-1 block text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                      Tax
                    </span>

                    <Input
                      type="number"
                      value={number(
                        item.igst
                      ).toFixed(2)}
                      readOnly
                      className="h-9 cursor-default bg-slate-50 text-right text-slate-600"
                    />
                  </div>

                  {/* ==================================
                      TOTAL + ACTIONS
                  ================================== */}

                  <div className="flex flex-col items-end gap-1.5 lg:pt-2">
                    <span className="text-[10px] font-medium uppercase text-slate-400 lg:hidden">
                      Total
                    </span>

                    <div className="text-right text-sm font-semibold tabular-nums text-slate-900">
                      ₹
                      {total.total.toFixed(
                        2
                      )}
                    </div>

                    <div className="flex justify-end gap-1.5">
                      {/* ADD */}

                      <Button
                        type="button"
                        size="icon"
                        aria-label="Add item"
                        onClick={() =>
                          append(
                            createEmptyItem()
                          )
                        }
                        className="size-8 cursor-pointer border-0 bg-primary p-2 text-white shadow-none"
                      >
                        <Plus className="size-4" />
                      </Button>

                      {/* REMOVE */}

                      <Button
                        type="button"
                        size="icon"
                        aria-label="Remove item"
                        onClick={() =>
                          removeLine(
                            index
                          )
                        }
                        className="size-8 cursor-pointer border-0 bg-red-500 p-2 text-white shadow-none hover:bg-red-500"
                      >
                        <Minus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* ==============================================
            FOOTER
        ============================================== */}

        <div className="border-t border-amber-100 bg-amber-50/90 px-3 py-3 text-sm font-semibold">
          {/* DESKTOP */}

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
              ₹
              {totals.subtotal.toFixed(
                2
              )}
            </div>

            <div className="text-right tabular-nums">
              ₹
              {totals.discount.toFixed(
                2
              )}
            </div>

            <div className="text-right tabular-nums">
              ₹
              {totals.tax.toFixed(2)}
            </div>

            <div className="text-right tabular-nums text-slate-900">
              ₹
              {totals.total.toFixed(
                2
              )}
            </div>
          </div>

          {/* MOBILE */}

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:hidden">
            <div className="text-slate-700">
              Total Inv. Val
            </div>

            <div className="text-right tabular-nums text-slate-900">
              ₹
              {totals.total.toFixed(
                2
              )}
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
              ₹
              {totals.subtotal.toFixed(
                2
              )}
            </div>

            <div className="text-xs font-medium text-slate-500">
              Discount
            </div>

            <div className="text-right tabular-nums">
              ₹
              {totals.discount.toFixed(
                2
              )}
            </div>

            <div className="text-xs font-medium text-slate-500">
              Tax
            </div>

            <div className="text-right tabular-nums">
              ₹
              {totals.tax.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ITEM PICKER
========================================================= */

function ItemPicker({
  value,
  items,
  loading,
  onSelect,
  fallbackName,
}: {
  value: string;
  items: CatalogItem[];
  loading: boolean;
  onSelect: (id: string) => void;
  fallbackName?: string;
}) {
  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const selected = items.find(
    (item) =>
      String(item.id) ===
      String(value)
  );

  const normalizedQuery =
    query.trim().toLowerCase();

  const matches = items.filter(
    (item) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        (item.name ?? "")
          .toLowerCase()
          .includes(
            normalizedQuery
          ) ||
        (item.itemCode ?? "")
          .toLowerCase()
          .includes(
            normalizedQuery
          ) ||
        (item.categoryName ?? "")
          .toLowerCase()
          .includes(
            normalizedQuery
          ) ||
        (item.type ?? "")
          .toLowerCase()
          .includes(
            normalizedQuery
          )
      );
    }
  );

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
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
                    selected.type ===
                    "SERVICE"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {selected.type ===
                  "SERVICE"
                    ? "SRV"
                    : "PRD"}
                </span>

                <span className="truncate">
                  {selected.name}
                </span>
              </span>
            ) : value && fallbackName ? (
              // ------------------------------------------------
              // EDIT MODE FALLBACK:
              // The catalog hasn't loaded yet, or this product/
              // service no longer exists in the live catalog.
              // Still show the name that was saved on the
              // invoice itself instead of looking "empty".
              // ------------------------------------------------
              <span className="truncate text-slate-700">
                {fallbackName}
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
        {/* SEARCH */}

        <div className="relative mb-1.5">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            onKeyDown={(event) =>
              event.stopPropagation()
            }
            placeholder="Search name or code..."
            className="h-8 pl-8 text-sm"
          />
        </div>

        {/* RESULTS */}

        <div className="max-h-52 overflow-y-auto">
          {matches.length ? (
            matches.map((item) => {
              const gstRate =
                number(
                  item.gstRate
                ) ||
                getTaxRate(
                  item.tax
                );

              return (
                <DropdownMenuItem
                  key={item.id}
                  onSelect={() => {
                    onSelect(
                      String(
                        item.id
                      )
                    );

                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex-col items-start gap-0.5 py-1.5"
                >
                  <div className="flex w-full items-center gap-1.5">
                    <span
                      className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                        item.type ===
                        "SERVICE"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {item.type ===
                      "SERVICE"
                        ? "SRV"
                        : "PRD"}
                    </span>

                    <span className="truncate text-sm font-medium">
                      {item.name ??
                        "Unnamed"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-1.5 text-[11px] text-muted-foreground">
                    {item.itemCode && (
                      <span>
                        {
                          item.itemCode
                        }
                      </span>
                    )}

                    {item.unit && (
                      <span>
                        ·{" "}
                        {item.unit}
                      </span>
                    )}

                    {item.salePrice !=
                      null &&
                      item.salePrice >
                        0 && (
                        <span>
                          · ₹
                          {
                            item.salePrice
                          }
                        </span>
                      )}

                    <span>
                      · {gstRate}% GST
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })
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