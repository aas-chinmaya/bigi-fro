
"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  fetchPaymentReceiptById,
  fetchPaymentReceipts,
} from "../store/payment-receipt.slice";

import type {
  PaymentReceiptQueryParams,
} from "../types/payment-receipt.types";

export const usePaymentReceiptQuery = (
  params?: PaymentReceiptQueryParams,
  id?: string,
) => {
  const dispatch = useAppDispatch();

  const {
    paymentReceipts,
    selectedPaymentReceipt,
    loading,
    error,
    pagination,
  } = useAppSelector((state) => state.paymentReceipt);

  useEffect(() => {
    if (id) {
      dispatch(fetchPaymentReceiptById(id));
      return;
    }

    dispatch(fetchPaymentReceipts(params));
  }, [dispatch, id, params]);

  return {
    paymentReceipts,
    paymentReceipt: selectedPaymentReceipt,
    loading,
    error,
    pagination,
  };
};
