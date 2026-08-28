
"use client";

import { useCallback } from "react";

import { useAppDispatch } from "@/store/hooks";

import {
  addMoneyReceipt,
  clearMoneyReceiptError,
  clearSelectedMoneyReceipt,
  editMoneyReceipt,
} from "../store/money-receipt.slice";

import type {
  CreateMoneyReceiptPayload,
  UpdateMoneyReceiptPayload,
} from "../types/money-receipt.types";

export const useMoneyReceiptActions = () => {
  const dispatch = useAppDispatch();

  const createMoneyReceipt = useCallback(
    (payload: CreateMoneyReceiptPayload) => {
      return dispatch(addMoneyReceipt(payload));
    },
    [dispatch],
  );

  const updateMoneyReceipt = useCallback(
    (id: string, payload: UpdateMoneyReceiptPayload) => {
      return dispatch(
        editMoneyReceipt({
          id,
          payload,
        }),
      );
    },
    [dispatch],
  );

  const clearSelectedMoneyReceipt = useCallback(() => {
    dispatch(clearSelectedMoneyReceipt());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearMoneyReceiptError());
  }, [dispatch]);

  return {
    createMoneyReceipt,
    updateMoneyReceipt,
    clearSelectedMoneyReceipt,
    clearError,
  };
};

