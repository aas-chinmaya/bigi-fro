"use client";

import { useMemo, useState } from "react";
import { useInvoiceItems } from "@/modules/items/hooks/useInvoiceItems"; // adjust path if needed
import type { ProductOption } from "../types/quotation-form.types";

/**
 * Adapts the shared useInvoiceItems hook into the option shape
 * the quotation item picker needs, with client-side search.
 */
export function useProductOptions() {
  const { items, loading, error, refetch } = useInvoiceItems();
  const [search, setSearch] = useState("");

  const options: ProductOption[] = useMemo(
    () =>
      (items || []).map((item: any) => ({
        value: String(item.id),
        label: item.name || "Unnamed item",
        itemCode: item.itemCode,
        unit: item.unit,
        rate: Number(item.salePrice ?? 0),
        taxRate: Number(item.tax?.rate ?? item.taxRate ?? 0),
        hsnCode: item.hsnSacCode,
        type: item.type,                    // "PRODUCT" | "SERVICE"
        classification: item.classification, // "GOODS" | "SERVICES"
        description: item.description,
        categoryName: item.categoryName,
        brandName: item.brandName,
        rawItem: item.rawItem,
      })),
    [items]
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const term = search.trim().toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.itemCode?.toLowerCase().includes(term) ||
        opt.hsnCode?.toLowerCase().includes(term)
    );
  }, [options, search]);

  return {
    options: filteredOptions,
    allOptions: options,
    loading,
    error,
    search,
    setSearch,
    refetch,
    getItemById: (id: string) => options.find((opt) => opt.value === id),
  };
}