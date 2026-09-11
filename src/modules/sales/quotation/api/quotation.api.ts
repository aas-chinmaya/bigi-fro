

// import { baseApi } from "@/services/baseApi";

// import type {
//   QuotationListParams,
//   QuotationListResponse,
//   QuotationResponse,
//   QuotationCreatePayload,
//   QuotationUpdatePayload,
//   QuotationStatusPayload,
//   QuotationCancelPayload,
//   QuotationSendPayload,
//   QuotationDuplicatePayload,
//   QuotationConvertToInvoicePayload,
// } from "../types/quotation.types";

// const QUOTATION_ENDPOINT = "/quotation";

// export const quotationApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // ========================================================
//     // GET ALL QUOTATIONS
//     // GET /quotation
//     // ========================================================

//     getQuotations: builder.query<
//       QuotationListResponse,
//       QuotationListParams | undefined
//     >({
//       query: (params) => ({
//         url: `${QUOTATION_ENDPOINT}/all`,
//         method: "GET",
//         params,
//       }),

//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({
//                 type: "Quotation" as const,
//                 id,
//               })),
//               {
//                 type: "Quotation" as const,
//                 id: "LIST",
//               },
//             ]
//           : [
//               {
//                 type: "Quotation" as const,
//                 id: "LIST",
//               },
//             ],
//     }),

//     // ========================================================
//     // GET QUOTATION BY ID
//     // GET /quotation/:id
//     // ========================================================

//     getQuotationById: builder.query<QuotationResponse, string>({
//       query: (id) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}`,
//         method: "GET",
//       }),

//       providesTags: (_result, _error, id) => [
//         {
//           type: "Quotation",
//           id,
//         },
//       ],
//     }),

//     // ========================================================
//     // GET QUOTATIONS BY STATUS
//     // GET /quotation/status/:status
//     // ========================================================

//     getQuotationsByStatus: builder.query<
//       QuotationListResponse,
//       {
//         status: QuotationStatusPayload["status"];
//         params?: QuotationListParams;
//       }
//     >({
//       query: ({ status, params }) => ({
//         url: `${QUOTATION_ENDPOINT}/status/${status}`,
//         method: "GET",
//         params,
//       }),

//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({
//                 type: "Quotation" as const,
//                 id,
//               })),
//               {
//                 type: "Quotation" as const,
//                 id: "LIST",
//               },
//             ]
//           : [
//               {
//                 type: "Quotation" as const,
//                 id: "LIST",
//               },
//             ],
//     }),

//     // ========================================================
//     // CREATE QUOTATION
//     // POST /quotation
//     // ========================================================

//     createQuotation: builder.mutation<
//       QuotationResponse,
//       QuotationCreatePayload
//     >({
//       query: (data) => ({
//         url: QUOTATION_ENDPOINT,
//         method: "POST",
//         data,
//       }),

//       invalidatesTags: [
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // UPDATE QUOTATION
//     // PATCH /quotation/:id
//     // ========================================================

//     updateQuotation: builder.mutation<
//       QuotationResponse,
//       {
//         id: string;
//         data: QuotationUpdatePayload;
//       }
//     >({
//       query: ({ id, data }) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}`,
//         method: "PATCH",
//         data,
//       }),

//       invalidatesTags: (_result, _error, { id }) => [
//         {
//           type: "Quotation",
//           id,
//         },
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // DELETE QUOTATION
//     // DELETE /quotation/:id
//     // ========================================================

//     deleteQuotation: builder.mutation<unknown, string>({
//       query: (id) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}`,
//         method: "DELETE",
//       }),

//       invalidatesTags: [
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // UPDATE QUOTATION STATUS
//     // PATCH /quotation/:id/status
//     // ========================================================

//     updateQuotationStatus: builder.mutation<
//       QuotationResponse,
//       {
//         id: string;
//         data: QuotationStatusPayload;
//       }
//     >({
//       query: ({ id, data }) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}/status`,
//         method: "PATCH",
//         data,
//       }),

//       invalidatesTags: (_result, _error, { id }) => [
//         {
//           type: "Quotation",
//           id,
//         },
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // CANCEL QUOTATION
//     // PATCH /quotation/:id/cancel
//     // ========================================================

//     cancelQuotation: builder.mutation<
//       QuotationResponse,
//       {
//         id: string;
//         data?: QuotationCancelPayload;
//       }
//     >({
//       query: ({ id, data }) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}/cancel`,
//         method: "PATCH",
//         data,
//       }),

//       invalidatesTags: (_result, _error, { id }) => [
//         {
//           type: "Quotation",
//           id,
//         },
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // SEND QUOTATION
//     // POST /quotation/:id/send
//     // ========================================================

//     sendQuotation: builder.mutation<
//       unknown,
//       {
//         id: string;
//         data?: QuotationSendPayload;
//       }
//     >({
//       query: ({ id, data }) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}/send`,
//         method: "POST",
//         data,
//       }),

//       invalidatesTags: (_result, _error, { id }) => [
//         {
//           type: "Quotation",
//           id,
//         },
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // DUPLICATE QUOTATION
//     // POST /quotation/:id/duplicate
//     // ========================================================

//     duplicateQuotation: builder.mutation<
//       QuotationResponse,
//       {
//         id: string;
//         data?: QuotationDuplicatePayload;
//       }
//     >({
//       query: ({ id, data }) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}/duplicate`,
//         method: "POST",
//         data,
//       }),

//       invalidatesTags: [
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),

//     // ========================================================
//     // CONVERT QUOTATION TO INVOICE
//     // POST /quotation/:id/convert-to-invoice
//     // ========================================================

//     convertQuotationToInvoice: builder.mutation<
//       unknown,
//       {
//         id: string;
//         data?: QuotationConvertToInvoicePayload;
//       }
//     >({
//       query: ({ id, data }) => ({
//         url: `${QUOTATION_ENDPOINT}/${id}/convert-to-invoice`,
//         method: "POST",
//         data,
//       }),

//       invalidatesTags: (_result, _error, { id }) => [
//         {
//           type: "Quotation",
//           id,
//         },
//         {
//           type: "Quotation",
//           id: "LIST",
//         },
//       ],
//     }),
//   }),
// });

// // ============================================================
// // GENERATED HOOKS
// // ============================================================

// export const {
//   // Queries
//   useGetQuotationsQuery,
//   useGetQuotationByIdQuery,
//   useGetQuotationsByStatusQuery,

//   // Mutations
//   useCreateQuotationMutation,
//   useUpdateQuotationMutation,
//   useDeleteQuotationMutation,
//   useUpdateQuotationStatusMutation,
//   useCancelQuotationMutation,
//   useSendQuotationMutation,
//   useDuplicateQuotationMutation,
//   useConvertQuotationToInvoiceMutation,
// } = quotationApi;









// ============================================================
// quotation.api.ts
// ============================================================

import { baseApi } from "@/services/baseApi";

import type {
  QuotationListParams,
  QuotationListResponse,
  QuotationResponse,
  QuotationCreatePayload,
  QuotationUpdatePayload,
  QuotationStatusPayload,
  QuotationCancelPayload,
  QuotationSendPayload,
  QuotationDuplicatePayload,
  QuotationConvertToInvoicePayload,
} from "../types/quotation.types";

const QUOTATION_ENDPOINT = "/quotation";

export const quotationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================
    // GET ALL QUOTATIONS
    // GET /quotation/all
    // ========================================================
    getQuotations: builder.query<
      QuotationListResponse,
      QuotationListParams | undefined
    >({
      query: (params) => ({
        url: `${QUOTATION_ENDPOINT}/all`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Quotation" as const,
                id,
              })),
              { type: "Quotation" as const, id: "LIST" },
            ]
          : [{ type: "Quotation" as const, id: "LIST" }],
    }),

    // ========================================================
    // GET QUOTATION BY ID
    // GET /quotation/:id
    // ========================================================
    getQuotationById: builder.query<QuotationResponse, string>({
      query: (id) => ({
        url: `${QUOTATION_ENDPOINT}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Quotation", id }],
    }),

    // ========================================================
    // GET QUOTATIONS BY STATUS
    // GET /quotation/status/:status
    // ========================================================
    getQuotationsByStatus: builder.query<
      QuotationListResponse,
      {
        status: QuotationStatusPayload["status"];
        params?: QuotationListParams;
      }
    >({
      query: ({ status, params }) => ({
        url: `${QUOTATION_ENDPOINT}/status/${status}`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Quotation" as const,
                id,
              })),
              { type: "Quotation" as const, id: "LIST" },
            ]
          : [{ type: "Quotation" as const, id: "LIST" }],
    }),

    // ========================================================
    // CREATE QUOTATION
    // POST /quotation
    // ========================================================
    createQuotation: builder.mutation<
      QuotationResponse,
      QuotationCreatePayload
    >({
      query: (data) => ({
        url: QUOTATION_ENDPOINT,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Quotation", id: "LIST" }],
    }),

    // ========================================================
    // UPDATE QUOTATION
    // PATCH /quotation/:id
    // ========================================================
    updateQuotation: builder.mutation<
      QuotationResponse,
      { id: string; data: QuotationUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Quotation", id },
        { type: "Quotation", id: "LIST" },
      ],
    }),

    // ========================================================
    // DELETE QUOTATION
    // DELETE /quotation/:id
    // ========================================================
    deleteQuotation: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `${QUOTATION_ENDPOINT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Quotation", id: "LIST" }],
    }),

    // ========================================================
    // UPDATE QUOTATION STATUS
    // PATCH /quotation/:id/status
    // ========================================================
    updateQuotationStatus: builder.mutation<
      QuotationResponse,
      { id: string; data: QuotationStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Quotation", id },
        { type: "Quotation", id: "LIST" },
      ],
    }),

    // ========================================================
    // CANCEL QUOTATION
    // PATCH /quotation/:id/cancel
    // ========================================================
    cancelQuotation: builder.mutation<
      QuotationResponse,
      { id: string; data?: QuotationCancelPayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/cancel`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Quotation", id },
        { type: "Quotation", id: "LIST" },
      ],
    }),

    // ========================================================
    // SEND QUOTATION
    // POST /quotation/:id/send
    // ========================================================
    sendQuotation: builder.mutation<
      unknown,
      { id: string; data?: QuotationSendPayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/send`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Quotation", id },
        { type: "Quotation", id: "LIST" },
      ],
    }),

    // ========================================================
    // DUPLICATE QUOTATION
    // POST /quotation/:id/duplicate
    // ========================================================
    duplicateQuotation: builder.mutation<
      QuotationResponse,
      { id: string; data?: QuotationDuplicatePayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/duplicate`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Quotation", id: "LIST" }],
    }),

    // ========================================================
    // CONVERT QUOTATION TO INVOICE
    // POST /quotation/:id/convert-to-invoice
    // ========================================================
    convertQuotationToInvoice: builder.mutation<
      unknown,
      { id: string; data?: QuotationConvertToInvoicePayload }
    >({
      query: ({ id, data }) => ({
        url: `${QUOTATION_ENDPOINT}/${id}/convert-to-invoice`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Quotation", id },
        { type: "Quotation", id: "LIST" },
      ],
    }),
  }),
});

// ============================================================
// GENERATED HOOKS
// ============================================================

export const {
  // Queries
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useGetQuotationsByStatusQuery,

  // Mutations
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useUpdateQuotationStatusMutation,
  useCancelQuotationMutation,
  useSendQuotationMutation,
  useDuplicateQuotationMutation,
  useConvertQuotationToInvoiceMutation,
} = quotationApi;