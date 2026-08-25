"use client";

import { useEffect } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import {
  fetchCashReceiptById,
  fetchCashReceipts,
} from "../store/cash-receipt.slice";

import type {
  CashReceiptQueryParams,
} from "../types/cash-receipt.types";

export const useCashReceiptQuery = (
  params?: CashReceiptQueryParams,
  id?: string,
) => {
  const dispatch = useAppDispatch();

  const {
    cashReceipts,
    selectedCashReceipt,
    loading,
    error,
    pagination,
  } = useAppSelector(
    (state) => state.cashReceipt,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCashReceiptById(id));
      return;
    }

    dispatch(fetchCashReceipts(params));
  }, [dispatch, id, params]);

  return {
    cashReceipts,
    cashReceipt: selectedCashReceipt,
    loading,
    error,
    pagination,
  };
};