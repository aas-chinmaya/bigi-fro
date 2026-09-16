


"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { QuotationFormValues } from "../../types/quotation-form.types";

// ── Dummy items (replace later with API) ───────────────────────────────────
const DUMMY_ITEMS = [
  {
    id: "item-1",
    name: "Website Development",
    description: "Custom responsive website",
    rate: 45000,
    unit: "NOS",
    taxRate: 18,
  },
  {
    id: "item-2",
    name: "UI/UX Design",
    description: "Figma design system + screens",
    rate: 28000,
    unit: "NOS",
    taxRate: 18,
  },
  {
    id: "item-3",
    name: "SEO Package (Monthly)",
    description: "On-page + off-page SEO",
    rate: 12000,
    unit: "MOS",
    taxRate: 18,
  },
  {
    id: "item-4",
    name: "Cloud Hosting (Annual)",
    description: "Managed VPS hosting",
    rate: 18000,
    unit: "YRS",
    taxRate: 18,
  },
  {
    id: "item-5",
    name: "Maintenance Retainer",
    description: "Monthly support & updates",
    rate: 8000,
    unit: "MOS",
    taxRate: 18,
  },
];

interface QuotationItemRowProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuotationItemRow({
  index,
  onRemove,
  canRemove,
}: QuotationItemRowProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemErrors = errors.items?.[index];
  const currentItemName = watch(`items.${index}.itemName`) || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = DUMMY_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (item: (typeof DUMMY_ITEMS)[0]) => {
    setValue(`items.${index}.itemId`, item.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`items.${index}.itemName`, item.name, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`items.${index}.description`, item.description, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`items.${index}.rate`, item.rate, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`items.${index}.unit`, item.unit, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`items.${index}.taxRate`, item.taxRate, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSearch(item.name);
    setIsOpen(false);
  };

  return (
    <div className="grid grid-cols-12 gap-3 items-start rounded-lg border p-3">
      {/* ── Item Search / Select ── */}
      <div className="col-span-12 md:col-span-4 space-y-1 relative" ref={containerRef}>
        <Input
          placeholder="Search or type item name..."
          value={search || currentItemName}
          onChange={(e) => {
            setSearch(e.target.value);
            setValue(`items.${index}.itemName`, e.target.value, {
              shouldDirty: true,
            });
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-10"
        />

        {/* Hidden fields for form */}
        <input type="hidden" {...register(`items.${index}.itemId`)} />
        <input type="hidden" {...register(`items.${index}.itemName`)} />

        {itemErrors?.itemName && (
          <p className="text-xs text-destructive">
            {itemErrors.itemName.message}
          </p>
        )}

        {/* Simple dropdown */}
        {isOpen && filteredItems.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md max-h-56 overflow-auto">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors flex flex-col"
                onClick={() => handleSelect(item)}
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  ₹{item.rate.toLocaleString()} · {item.unit}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quantity */}
      <div className="col-span-4 md:col-span-2">
        <Input
          type="number"
          step="any"
          min={0}
          placeholder="Qty"
          className="h-10"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
        />
      </div>

      {/* Rate */}
      <div className="col-span-4 md:col-span-2">
        <Input
          type="number"
          step="any"
          min={0}
          placeholder="Rate"
          className="h-10"
          {...register(`items.${index}.rate`, { valueAsNumber: true })}
        />
      </div>

      {/* Tax % */}
      <div className="col-span-4 md:col-span-2">
        <Input
          type="number"
          step="any"
          min={0}
          placeholder="Tax %"
          className="h-10"
          {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
        />
      </div>

      {/* Unit */}
      <div className="col-span-4 md:col-span-1">
        <Input
          placeholder="Unit"
          className="h-10"
          {...register(`items.${index}.unit`)}
        />
      </div>

      {/* Remove */}
      <div className="col-span-4 md:col-span-1 flex justify-end">
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}