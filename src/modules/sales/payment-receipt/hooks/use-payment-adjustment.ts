"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  createPaymentAdjustment,
  fetchPaymentAdjustmentById,
} from "../store/payment-receipt.slice";

import type {
  PaymentAdjustmentPayload,
} from "../types/payment-receipt.types";

export const usePaymentAdjustment = () => {
  const dispatch = useAppDispatch();

  const {
    paymentAdjustment,
    loading,
    error,
  } = useAppSelector(
    (state) => state.paymentReceipt,
  );

  const createAdjustment = useCallback(
    async (
      payload: PaymentAdjustmentPayload,
    ) => {
      return dispatch(
        createPaymentAdjustment(payload),
      ).unwrap();
    },
    [dispatch],
  );

  const getAdjustmentById = useCallback(
    async (
      id: string,
      businessId?: string,
    ) => {
      return dispatch(
        fetchPaymentAdjustmentById({
          id,
          businessId,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  return {
    paymentAdjustment,

    loading,

    error,

    createAdjustment,

    getAdjustmentById,
  };
};