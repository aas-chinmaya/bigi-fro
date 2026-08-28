
"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  fetchMoneyReceiptById,
  fetchMoneyReceipts,
} from "../store/money-receipt.slice";

import type {
  MoneyReceiptQueryParams,
} from "../types/money-receipt.types";

export const useMoneyReceiptQuery = (
  params?: MoneyReceiptQueryParams,
  id?: string,
) => {
  const dispatch = useAppDispatch();

  const {
    moneyReceipts,
    selectedMoneyReceipt,
    loading,
    error,
    pagination,
  } = useAppSelector((state) => state.moneyReceipt);

  useEffect(() => {
    if (id) {
      dispatch(fetchMoneyReceiptById(id));
      return;
    }

    dispatch(fetchMoneyReceipts(params));
  }, [dispatch, id, params]);

  return {
    moneyReceipts,
    moneyReceipt: selectedMoneyReceipt,
    loading,
    error,
    pagination,
  };
};
