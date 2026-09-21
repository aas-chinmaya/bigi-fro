"use client";

import { useEffect, useMemo, useState } from "react";

export type SearchInvoice = {
  id: string;
  invoiceNumber: string;
  customerName?: string | null;
  grandTotal?: number;
  invoiceDate?: string | null;
  status?: string | null;
};

/**
 * Debounced invoice search.
 * Replace STATIC with RTK Query when invoice API is ready.
 */
const STATIC: SearchInvoice[] = [];

export function useSearchInvoice(query: string, delayMs = 300) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), delayMs);
    return () => clearTimeout(t);
  }, [query, delayMs]);

  const data = useMemo(() => {
    const q = debounced.toLowerCase();
    if (!q) return STATIC;
    return STATIC.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        (inv.customerName || "").toLowerCase().includes(q),
    );
  }, [debounced]);

  return {
    data,
    isLoading: false,
    debouncedQuery: debounced,
  };
}
