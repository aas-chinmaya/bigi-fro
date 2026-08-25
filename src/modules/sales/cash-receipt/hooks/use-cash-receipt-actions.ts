"use client";

import { useCallback } from "react";

import { useAppDispatch } from "@/store/hooks";

import {
  addCashReceipt,
  clearCashReceiptError,
  clearSelectedCashReceipt,
  editCashReceipt,
} from "../store/cash-receipt.slice";

import type {
  CreateCashReceiptPayload,
  UpdateCashReceiptPayload,
} from "../types/cash-receipt.types";

export const useCashReceiptActions = () => {
  const dispatch = useAppDispatch();

  const createCashReceipt = useCallback(
    (payload: CreateCashReceiptPayload) => {
      return dispatch(addCashReceipt(payload));
    },
    [dispatch],
  );

  const updateCashReceipt = useCallback(
    (
      id: string,
      payload: UpdateCashReceiptPayload,
    ) => {
      return dispatch(
        editCashReceipt({
          id,
          payload,
        }),
      );
    },
    [dispatch],
  );

  const clearSelectedCashReceipt =
    useCallback(() => {
      dispatch(clearSelectedCashReceipt());
    }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCashReceiptError());
  }, [dispatch]);

  return {
    createCashReceipt,
    updateCashReceipt,
    clearSelectedCashReceipt,
    clearError,
  };
};