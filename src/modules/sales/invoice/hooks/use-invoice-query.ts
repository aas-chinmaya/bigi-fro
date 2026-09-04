"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "@/store/store";

import {
  fetchInvoices,
  fetchDrafts,
  fetchInvoiceById,
  fetchDraftById,
} from "../store/invoice.slice";

export function useInvoiceQuery(params?: Record<string, any>) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    invoices,
    invoicesMeta,
    drafts,
    draftsMeta,
    selectedInvoice,
    selectedDraft,
    loading,
    error,
  } = useSelector(
    (state: RootState) => state.invoice,
  );

  const getInvoices = (p?: Record<string, any>) => {
    return dispatch(fetchInvoices(p ?? params));
  };

  const getDrafts = (p?: Record<string, any>) => {
    return dispatch(fetchDrafts(p ?? params));
  };

  const getInvoiceById = (id: string) => {
    return dispatch(fetchInvoiceById(id));
  };

  const getDraftById = (id: string) => {
    return dispatch(fetchDraftById(id));
  };

  return {
    // Data
    invoices,
    invoicesMeta,
    draftsMeta,
    drafts,
    selectedInvoice,
    selectedDraft,

    // State
    loading,
    error,

    // Queries
    getInvoices,
    getDrafts,
    getInvoiceById,
    getDraftById,
  };
}