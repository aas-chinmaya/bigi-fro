"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useGetQuotationsQuery } from "../api/quotation.api";
import type { QuotationListParams, QuotationSource, QuotationStatus } from "../types/quotation.types";

const DEFAULT_LIMIT = 10;

export function useQuotationList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<QuotationStatus | "ALL">("ALL");
  const [source, setSource] = useState<QuotationSource | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Small inline debounce (no extra dependency) so search doesn't
  // fire a query on every keystroke.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 350);
  }, []);

  const params: QuotationListParams = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      search: search || undefined,
      status: status === "ALL" ? undefined : status,
      source: source === "ALL" ? undefined : source,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [page, search, status, source, fromDate, toDate],
  );

  const { data, isFetching, isLoading, refetch } = useGetQuotationsQuery(params);

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setSource("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return {
    quotations: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    refetch,

    page,
    setPage,

    search: searchInput,
    setSearch: handleSearchChange,

    status,
    setStatus: (value: QuotationStatus | "ALL") => {
      setStatus(value);
      setPage(1);
    },

    source,
    setSource: (value: QuotationSource | "ALL") => {
      setSource(value);
      setPage(1);
    },

    fromDate,
    setFromDate: (value: string) => {
      setFromDate(value);
      setPage(1);
    },

    toDate,
    setToDate: (value: string) => {
      setToDate(value);
      setPage(1);
    },

    resetFilters,
  };
}
