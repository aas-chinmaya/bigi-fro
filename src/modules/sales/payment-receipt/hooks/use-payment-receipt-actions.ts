
"use client";

import { useCallback } from "react";

import { useAppDispatch } from "@/store/hooks";

import {
  addPaymentReceipt,
  clearPaymentReceiptError,
  clearSelectedPaymentReceipt,
  editPaymentReceipt,
} from "../store/payment-receipt.slice";

import type {
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,
} from "../types/payment-receipt.types";

export const usePaymentReceiptActions = () => {
  const dispatch = useAppDispatch();

  const createPaymentReceipt = useCallback(
    (payload: CreatePaymentReceiptPayload) => {
      return dispatch(addPaymentReceipt(payload));
    },
    [dispatch],
  );

  const updatePaymentReceipt = useCallback(
    (id: string, payload: UpdatePaymentReceiptPayload) => {
      return dispatch(
        editPaymentReceipt({
          id,
          payload,
        }),
      );
    },
    [dispatch],
  );

  const clearSelectedPaymentReceiptAction = useCallback(() => {
    dispatch(clearSelectedPaymentReceipt());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearPaymentReceiptError());
  }, [dispatch]);

  return {
    createPaymentReceipt,
    updatePaymentReceipt,
    clearSelectedPaymentReceipt: clearSelectedPaymentReceiptAction,
    clearError,
  };
};

