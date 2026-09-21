"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useSearchInvoice,
  type SearchInvoice,
} from "@/modules/sales/shared/hooks/use-search-invoice";

export type SelectedInvoice = SearchInvoice;

export type InvoiceSearchSelectProps = {
  onSelect: (invoice: SelectedInvoice | null) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function InvoiceSearchSelect({
  onSelect,
  value,
  label = "Invoice",
  placeholder = "Search invoice number",
  disabled = false,
  className = "",
}: InvoiceSearchSelectProps) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: items, isLoading } = useSearchInvoice(query);

  useEffect(() => {
    if (value !== undefined && value !== query && !open) setQuery(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const clear = () => {
    setSelectedId(null);
    setQuery("");
    setOpen(false);
    onSelect(null);
  };

  return (
    <div className={`relative space-y-1 ${className}`} ref={containerRef}>
      {label ? (
        <Label className="text-[11px] font-medium text-slate-500">{label}</Label>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedId(null);
            onSelect(null);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="h-9 bg-white pl-8 pr-14 text-sm"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {isLoading && <Loader2 className="size-3.5 animate-spin text-slate-400" />}
          {query && !disabled && (
            <button
              type="button"
              onClick={clear}
              className="grid size-6 place-items-center rounded text-slate-400 hover:bg-slate-100"
              aria-label="Clear"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown className="size-3.5 text-slate-400" />
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" /> Searching…
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">No invoice found.</div>
          ) : (
            items.map((inv) => {
              const selected = selectedId === inv.id;
              return (
                <button
                  key={inv.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSelectedId(inv.id);
                    setQuery(inv.invoiceNumber);
                    setOpen(false);
                    onSelect(inv);
                  }}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-slate-100 px-3 py-2.5 text-left last:border-0 ${
                    selected ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-xs text-slate-500">
                      {inv.customerName || "—"}
                      {inv.grandTotal != null
                        ? ` · ₹${inv.grandTotal.toLocaleString("en-IN")}`
                        : ""}
                    </p>
                  </div>
                  {selected && <Check className="mt-1 size-4 shrink-0 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
