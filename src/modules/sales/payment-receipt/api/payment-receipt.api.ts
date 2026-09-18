
import { baseApi } from "@/services/baseApi";

import type {
  PaymentReceipt,
  PaymentReceiptListResponse,
  PaymentReceiptQueryParams,
  PaymentReceiptResponse,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,
  PaymentAdjustment,
  PaymentAdjustmentPayload,
} from "../types/payment-receipt.types";

const PAYMENT_RECEIPT_ENDPOINT = "/payment-receipts";
const PAYMENT_ADJUSTMENT_ENDPOINT = "/payment-adjustments";

export const paymentReceiptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================================
    // LIST
    // ==========================================================

    getPaymentReceipts: builder.query<
      PaymentReceiptListResponse,
      PaymentReceiptQueryParams | undefined
    >({
      query: (params) => ({
        url: PAYMENT_RECEIPT_ENDPOINT,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.length
          ? [
              ...result.data.map(({ id }) => ({
                type: "PaymentReceipt" as const,
                id,
              })),
              { type: "PaymentReceipt" as const, id: "LIST" },
            ]
          : [{ type: "PaymentReceipt" as const, id: "LIST" }],
    }),

    // ==========================================================
    // GET BY ID
    // ==========================================================
    // Backend wraps the single receipt as { success, message, data }.

    getPaymentReceiptById: builder.query<
      PaymentReceipt,
      { id: string; businessId?: string }
    >({
      query: ({ id, businessId }) => ({
        url: `${PAYMENT_RECEIPT_ENDPOINT}/${id}`,
        method: "GET",
        params: businessId ? { businessId } : undefined,
      }),
      transformResponse: (response: PaymentReceiptResponse) =>
        response.data,
      providesTags: (_result, _error, { id }) => [
        { type: "PaymentReceipt" as const, id },
      ],
    }),

    // ==========================================================
    // CREATE
    // ==========================================================
    // Backend returns the created receipt directly (no envelope).

    createPaymentReceipt: builder.mutation<
      PaymentReceipt,
      CreatePaymentReceiptPayload
    >({
      query: (data) => ({
        url: PAYMENT_RECEIPT_ENDPOINT,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "PaymentReceipt", id: "LIST" }],
    }),

    // ==========================================================
    // UPDATE
    // ==========================================================
    // Backend returns the updated receipt directly (no envelope).

    updatePaymentReceipt: builder.mutation<
      PaymentReceipt,
      { id: string; data: UpdatePaymentReceiptPayload }
    >({
      query: ({ id, data }) => ({
        url: `${PAYMENT_RECEIPT_ENDPOINT}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PaymentReceipt", id },
        { type: "PaymentReceipt", id: "LIST" },
      ],
    }),

    // ==========================================================
    // PAYMENT ADJUSTMENT
    // ==========================================================
    // Backend returns the adjustment directly (no envelope) for both
    // create and get-by-id, matching the original service.

    createPaymentAdjustment: builder.mutation<
      PaymentAdjustment,
      PaymentAdjustmentPayload
    >({
      query: (data) => ({
        url: `${PAYMENT_ADJUSTMENT_ENDPOINT}/adjust`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, payload) => [
        { type: "PaymentReceipt", id: payload.paymentId },
        { type: "PaymentAdjustment", id: "LIST" },
      ],
    }),

    getPaymentAdjustmentById: builder.query<
      PaymentAdjustment,
      { id: string; businessId?: string }
    >({
      query: ({ id, businessId }) => ({
        url: `${PAYMENT_ADJUSTMENT_ENDPOINT}/${id}`,
        method: "GET",
        params: businessId ? { businessId } : undefined,
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "PaymentAdjustment" as const, id },
      ],
    }),
  }),
});

export const {
  useGetPaymentReceiptsQuery,
  useGetPaymentReceiptByIdQuery,
  useCreatePaymentReceiptMutation,
  useUpdatePaymentReceiptMutation,
  useCreatePaymentAdjustmentMutation,
  useGetPaymentAdjustmentByIdQuery,
  useLazyGetPaymentAdjustmentByIdQuery,
} = paymentReceiptApi;
