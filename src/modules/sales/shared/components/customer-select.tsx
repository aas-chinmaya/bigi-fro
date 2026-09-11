"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useCustomers } from "@/modules/customers/hooks/use-customers";

import type { Customer } from "@/modules/customers/types";

// ==========================================================
// PROPS
// ==========================================================

interface CustomerSelectProps {
  value?: string;

  onChange: (customer: Customer | null) => void;

  placeholder?: string;
  disabled?: boolean;

  /**
   * Optional: control how many customers are displayed.
   */
  maxResults?: number;
}

// ==========================================================
// HELPERS
// ==========================================================

function clean(value?: string | null): string {
  return value?.trim() || "";
}

function getCustomerName(customer: Customer): string {
  return (
    clean((customer as any).name) ||
    clean((customer as any).customerName) ||
    clean((customer as any).companyName) ||
    String(customer.id)
  );
}

function getCustomerPhone(customer: Customer): string {
  return clean((customer as any).mobile);
}

function getCustomerEmail(customer: Customer): string {
  return clean((customer as any).email);
}

function getCustomerInitials(name: string): string {
  return String(name || "CU")
    .trim()
    .slice(0, 2)
    .toUpperCase();
}

// ==========================================================
// COMPONENT
// ==========================================================

export function CustomerSelect({
  value,
  onChange,
  placeholder = "Search customer",
  disabled = false,
  maxResults = 50,
}: CustomerSelectProps) {
  const { customers, loading } = useCustomers();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------------
  // SELECTED CUSTOMER
  // --------------------------------------------------------

  const selectedCustomer = useMemo(() => {
    if (!value) return null;

    return (
      (customers ?? []).find(
        (customer) =>
          String(customer.id) === String(value),
      ) ?? null
    );
  }, [customers, value]);

  // --------------------------------------------------------
  // SEARCH RESULTS
  // --------------------------------------------------------

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = customers ?? [];

    if (!query) {
      return list.slice(0, maxResults);
    }

    return list
      .filter((customer) => {
        const name = getCustomerName(customer);
        const phone = getCustomerPhone(customer);
        const email = getCustomerEmail(customer);

        return [name, phone, email]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(query),
          );
      })
      .slice(0, maxResults);
  }, [customers, search, maxResults]);

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

  const handleSelect = (customer: Customer) => {
    onChange(customer);

    setSearch(getCustomerName(customer));
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
  // INPUT VALUE
  // --------------------------------------------------------

  const inputValue = search;

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
        value={inputValue}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setSearch(event.target.value);
          setOpen(true);

          // If user starts changing the selected
          // customer, remove the current selection.
          if (selectedCustomer) {
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
          aria-label="Clear customer"
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
              Loading customers...
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredCustomers.length === 0 && (
              <div className="px-2 py-3 text-sm text-slate-500">
                No customer found.
              </div>
            )}

          {/* RESULTS */}

          {!loading &&
            filteredCustomers.map((customer) => {
              const id = String(customer.id);
              const name = getCustomerName(customer);
              const phone = getCustomerPhone(customer);
              const email = getCustomerEmail(customer);

              const selected =
                String(value) === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    handleSelect(customer)
                  }
                  className={`flex w-full items-start gap-3 rounded-lg border p-2 text-left transition-colors ${
                    selected
                      ? "border-primary/30 bg-primary/5"
                      : "border-slate-200 bg-white hover:bg-slate-100"
                  }`}
                >
                  {/* INITIALS */}

                  <span className="flex size-8 shrink-0 items-center justify-center bg-slate-100 text-[10px] font-semibold text-slate-700">
                    {getCustomerInitials(name)}
                  </span>

                  {/* CUSTOMER INFO */}

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {name}
                      </span>

                      {selected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </span>

                    {email && (
                      <span className="mt-1 block truncate text-[11px] text-slate-500">
                        {email}
                      </span>
                    )}

                    {phone && (
                      <span className="mt-1 block truncate text-[11px] text-slate-500">
                        {phone}
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