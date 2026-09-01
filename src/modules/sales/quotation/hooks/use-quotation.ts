"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store/store";

import {
  clearFilters,
  clearQuotationError,
  clearSelectedQuotation,
  createQuotation,
  deleteQuotation,
  fetchQuotationById,
  fetchQuotations,
  resetQuotationState,
  setFilters,
  setLimit,
  setPage,
  updateQuotation,
} from "../store/quotation.slice";

import type {
  QuotationCreatePayload,
  QuotationFilters,
  QuotationListParams,
  QuotationUpdatePayload,
} from "../types/quotation.types";

export const useQuotation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    quotations,
    selectedQuotation,
    page,
    limit,
    totalItems,
    totalPages,
    filters,
    loading,
    detailsLoading,
    saving,
    deleting,
    error,
  } = useSelector((state: RootState) => state.quotation);

  const getQuotations = useCallback(
    (params?: QuotationListParams) => dispatch(fetchQuotations(params)),
    [dispatch],
  );

  const getQuotationById = useCallback(
    (id: string) => dispatch(fetchQuotationById(id)),
    [dispatch],
  );

  const addQuotation = useCallback(
    (payload: QuotationCreatePayload) => dispatch(createQuotation(payload)),
    [dispatch],
  );

  const editQuotation = useCallback(
    (id: string, payload: QuotationUpdatePayload) =>
      dispatch(updateQuotation({ id, payload })),
    [dispatch],
  );

  const removeQuotation = useCallback(
    (id: string) => dispatch(deleteQuotation(id)),
    [dispatch],
  );

  const updateFilters = useCallback(
    (quotationFilters: QuotationFilters) => {
      dispatch(setFilters(quotationFilters));
    },
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const changePage = useCallback(
    (value: number) => {
      dispatch(setPage(value));
    },
    [dispatch],
  );

  const changeLimit = useCallback(
    (value: number) => {
      dispatch(setLimit(value));
    },
    [dispatch],
  );

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedQuotation());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearQuotationError());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetQuotationState());
  }, [dispatch]);

  return {
    // Data
    quotations,
    selectedQuotation,

    // Pagination
    page,
    limit,
    totalItems,
    totalPages,

    // Filters
    filters,

    // Loading states
    loading,
    detailsLoading,
    saving,
    deleting,

    // Error
    error,

    // Actions
    getQuotations,
    getQuotationById,
    addQuotation,
    editQuotation,
    removeQuotation,

    // Filters
    updateFilters,
    resetFilters,

    // Pagination
    changePage,
    changeLimit,

    // Utility
    clearSelected,
    clearError,
    reset,
  };
};