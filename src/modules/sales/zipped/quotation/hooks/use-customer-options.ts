"use client";

import { useEffect, useMemo, useState } from "react";

import { useCustomers } from "@/modules/customers/hooks/use-customers";
import type { CustomerOption } from "../types/quotation-form.types";

/**
 * Adapts the shared `useCustomers` hook into the option shape the
 * quotation customer picker needs, with a client-side search filter.
 */
export function useCustomerOptions() {
  const { customers, loading, fetchCustomers } = useCustomers(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: CustomerOption[] = useMemo(
    () =>
      (customers || []).map((customer: any) => ({
        value: String(customer.id),
        label: customer.name || customer.companyName || "Unnamed customer",
        phone: customer.mobile || customer.phone,
        email: customer.email,
        gstin: customer.gstin,
        billingAddress: customer.billingAddress || customer.address,
      })),
    [customers],
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const term = search.trim().toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.phone?.toLowerCase().includes(term) ||
        opt.email?.toLowerCase().includes(term),
    );
  }, [options, search]);

  return {
    options: filteredOptions,
    allOptions: options,
    loading,
    search,
    setSearch,
    getCustomerById: (id: string) => options.find((opt) => opt.value === id),
  };
}
