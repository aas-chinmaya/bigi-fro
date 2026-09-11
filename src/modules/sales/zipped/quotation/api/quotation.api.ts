import { baseApi } from "@/services/baseApi";

import type {
  QuotationCancelPayload,
  QuotationConvertToInvoicePayload,
  QuotationCreatePayload,
  QuotationDuplicatePayload,
  QuotationListParams,
  QuotationListResponse,
  QuotationResponse,
  QuotationSendPayload,
  QuotationStatus,
  QuotationStatusPayload,
  QuotationUpdatePayload,
} from "../types/quotation.types";

const QUOTATION_ENDPOINT = "/quotation";
const listTag = { type: "Quotation" as const, id: "LIST" };
const itemTag = (id: string) => ({ type: "Quotation" as const, id });

export const quotationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --------------------------------------------------
    // Queries
    // --------------------------------------------------

    getQuotations: builder.query<QuotationListResponse, QuotationListParams | undefined>({
      query: (params) => ({ url: QUOTATION_ENDPOINT, method: "GET", params }),
      providesTags: (result) =>
        result
          ? [...result.data.map((q) => itemTag(q.id)), listTag]
          : [listTag],
    }),

    getQuotationById: builder.query<QuotationResponse, string>({
      query: (id) => ({ url: `${QUOTATION_ENDPOINT}/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [itemTag(id)],
    }),

    getQuotationsByCustomer: builder.query<
      QuotationListResponse,
      { customerId: string; params?: QuotationListParams }
    >({
      query: ({ customerId, params }) => ({
        url: `${QUOTATION_ENDPOINT}/customer/${customerId}`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result ? [...result.data.map((q) => itemTag(q.id)), listTag] : [listTag],
    }),

    getQuotationsByStatus: builder.query<
      QuotationListResponse,
      { status: QuotationStatus; params?: QuotationListParams }
    >({
      query: ({ status, params }) => ({
        url: `${QUOTATION_ENDPOINT}/status/${status}`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result ? [...result.data.map((q) => itemTag(q.id)), listTag] : [listTag],
    }),

    // --------------------------------------------------
    // Mutations
    // --------------------------------------------------

    createQuotation: builder.mutation<QuotationResponse, QuotationCreatePayload>({
      query: (data) => ({ url: QUOTATION_ENDPOINT, method: "POST", data }),
      invalidatesTags: [listTag],
    }),

    updateQuotation: builder.mutation<
      QuotationResponse,
      { id: string; data: QuotationUpdatePayload }
    >({
      query: ({ id, data }) => ({ url: `${QUOTATION_ENDPOINT}/${id}`, method: "PATCH", data }),
      invalidatesTags: (_result, _error, { id }) => [itemTag(id), listTag],
    }),

    deleteQuotation: builder.mutation<unknown, string>({
      query: (id) => ({ url: `${QUOTATION_ENDPOINT}/${id}`, method: "DELETE" }),
      invalidatesTags: [listTag],
    }),

    updateQuotationStatus: builder.mutation<
      QuotationResponse,
      { id: string; data: QuotationStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [itemTag(id), listTag],
    }),

    cancelQuotation: builder.mutation<
      QuotationResponse,
      { id: string; data?: QuotationCancelPayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/cancel`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [itemTag(id), listTag],
    }),

    sendQuotation: builder.mutation<unknown, { id: string; data?: QuotationSendPayload }>({
      query: ({ id, data }) => ({ url: `${QUOTATION_ENDPOINT}/${id}/send`, method: "POST", data }),
      invalidatesTags: (_result, _error, { id }) => [itemTag(id), listTag],
    }),

    duplicateQuotation: builder.mutation<
      QuotationResponse,
      { id: string; data?: QuotationDuplicatePayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/duplicate`,
        method: "POST",
        data,
      }),
      invalidatesTags: [listTag],
    }),

    convertQuotationToInvoice: builder.mutation<
      unknown,
      { id: string; data?: QuotationConvertToInvoicePayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/convert-to-invoice`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [itemTag(id), listTag],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useLazyGetQuotationByIdQuery,
  useGetQuotationsByCustomerQuery,
  useGetQuotationsByStatusQuery,

  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,

  useUpdateQuotationStatusMutation,
  useCancelQuotationMutation,
  useSendQuotationMutation,
  useDuplicateQuotationMutation,
  useConvertQuotationToInvoiceMutation,
} = quotationApi;
