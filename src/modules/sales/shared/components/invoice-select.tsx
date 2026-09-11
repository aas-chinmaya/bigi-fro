"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, FileText, Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

// ==========================================================
// PROPS
// ==========================================================

interface InvoiceSelectProps {
  value?: string;

  onChange: (invoiceId: string | null) => void;

  placeholder?: string;
  disabled?: boolean;

  maxResults?: number;
}

// ==========================================================
// HELPERS
// ==========================================================

function clean(value?: string | null): string {
  return value?.trim() || "";
}

function getInvoiceNumber(invoice: any): string {
  return (
    clean(invoice.invoiceNumber) ||
    clean(invoice.id) ||
    "Invoice"
  );
}

function getCustomerName(invoice: any): string {
  return (
    clean(invoice.customerName) ||
    clean(invoice.customerId) ||
    "Unknown customer"
  );
}

// ==========================================================
// COMPONENT
// ==========================================================

export function InvoiceSelect({
  value,
  onChange,
  placeholder = "Search invoice by ID or number",
  disabled = false,
  maxResults = 50,
}: InvoiceSelectProps) {
  const { invoices, getInvoices, loading } = useInvoiceQuery();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------------
  // LOAD INVOICES
  // --------------------------------------------------------

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  // --------------------------------------------------------
  // SELECTED INVOICE
  // --------------------------------------------------------

  const selectedInvoice = useMemo(() => {
    if (!value) return null;

    return (
      (invoices ?? []).find(
        (invoice: any) =>
          String(invoice.id) === String(value),
      ) ?? null
    );
  }, [invoices, value]);

  // --------------------------------------------------------
  // SEARCH RESULTS
  // --------------------------------------------------------

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = invoices ?? [];

    if (!query) {
      return list.slice(0, maxResults);
    }

    return list
      .filter((invoice: any) => {
        const invoiceId = clean(invoice.id);
        const invoiceNumber = clean(
          invoice.invoiceNumber,
        );
        const customerName = clean(
          invoice.customerName,
        );
        const customerId = clean(invoice.customerId);

        return [
          invoiceId,
          invoiceNumber,
          customerName,
          customerId,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(query),
          );
      })
      .slice(0, maxResults);
  }, [invoices, search, maxResults]);

  // --------------------------------------------------------
  // CLOSE ON OUTSIDE CLICK
  // --------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // --------------------------------------------------------
  // SELECT
  // --------------------------------------------------------

  const handleSelect = (invoice: any) => {
    const id = String(invoice.id);

    onChange(id);

    setSearch(getInvoiceNumber(invoice));
    setOpen(false);
  };

  // --------------------------------------------------------
  // CLEAR
  // --------------------------------------------------------

  const handleClear = () => {
    setSearch("");
    onChange(null);
    setOpen(false);
  };

  // --------------------------------------------------------
  // KEEP DISPLAY IN SYNC
  // --------------------------------------------------------

  useEffect(() => {
    if (selectedInvoice && !search) {
      setSearch(
        getInvoiceNumber(selectedInvoice),
      );
    }
  }, [selectedInvoice, search]);

  // ========================================================
  // UI
  // ========================================================

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />

      <Input
        value={search}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setSearch(event.target.value);
          setOpen(true);

          // If the user changes the search after
          // selecting an invoice, clear the selection.
          if (selectedInvoice) {
            onChange(null);
          }
        }}
        className="h-10 border-slate-200 bg-slate-50 pl-9 pr-9"
      />

      {search && (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-1 text-slate-500 hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Clear invoice"
        >
          <X className="size-4" />
        </button>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[260px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {/* LOADING */}

          {loading && (
            <div className="flex items-center gap-2 px-2 py-3 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Loading invoices...
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredInvoices.length === 0 && (
              <div className="px-2 py-3 text-sm text-slate-500">
                No invoice found.
              </div>
            )}

          {/* RESULTS */}

          {!loading &&
            filteredInvoices.map((invoice: any) => {
              const id = String(invoice.id);
              const invoiceNumber =
                getInvoiceNumber(invoice);
              const customerName =
                getCustomerName(invoice);

              const selected =
                String(value) === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    handleSelect(invoice)
                  }
                  className={`flex w-full items-start gap-3 rounded-lg border p-2 text-left transition-colors ${
                    selected
                      ? "border-primary/30 bg-primary/5"
                      : "border-slate-200 bg-white hover:bg-slate-100"
                  }`}
                >
                  {/* ICON */}

                  <span className="flex size-8 shrink-0 items-center justify-center bg-slate-100 text-slate-600">
                    <FileText className="size-4" />
                  </span>

                  {/* INVOICE INFO */}

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {invoiceNumber}
                      </span>

                      {selected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </span>

                    <span className="mt-1 block truncate text-[11px] text-slate-500">
                      Customer: {customerName}
                    </span>

                    {invoiceNumber !== id && (
                      <span className="mt-1 block truncate text-[10px] text-slate-400">
                        ID: {id}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}