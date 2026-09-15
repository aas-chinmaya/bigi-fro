

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
    // getQuotationById: builder.query<QuotationResponse, string>({
    //   query: (id) => ({
    //     url: `${QUOTATION_ENDPOINT}/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: (_result, _error, id) => [{ type: "Quotation", id }],
    // }),


    getQuotationById: builder.query<QuotationResponse, string>({
  // Temporary dummy response for development
  queryFn: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const dummyQuotation: Quotation = {
      id: id,
      quotationNumber: "QT-2026-0042",
      quotationDate: "2026-09-10",
      validUntil: "2026-10-10",
      status: "sent",
      currency: "INR",
      poNumber: "PO-77821",
      referenceNumber: "REF-5521",
      notes: "Thank you for your business.",
      internalNotes: "Follow up after 3 days",
      subtitle: "Quotation for Office Furniture",

      // ---------- FROM ----------
      fromName: "Bigi Furniture Pvt Ltd",
      fromEmail: "sales@bigi.in",
      fromPhone: "+91 98765 43210",
      fromGstin: "27AABCU9603R1ZM",
      fromPan: "AABCU9603R",
      fromAddressLine1: "Plot No. 45, Industrial Area",
      fromAddressLine2: "MIDC Phase 2",
      fromCity: "Pune",
      fromState: "Maharashtra",
      fromCountry: "India",
      fromPincode: "411019",
      fromLogoUrl: null,

      // ---------- TO ----------
      customerId: "cust_123",
      toName: "TechNova Solutions",
      toEmail: "accounts@technova.com",
      toPhone: "+91 91234 56789",
      toGstin: "29AABCT1332L1Z5",
      toPan: "AABCT1332L",
      toContactPerson: "Rahul Mehta",
      toAddressLine1: "12th Floor, Cyber Towers",
      toAddressLine2: "Hitech City",
      toCity: "Hyderabad",
      toState: "Telangana",
      toCountry: "India",
      toPincode: "500081",

      // ---------- Items ----------
      items: [
        {
          id: "item_1",
          productId: "prod_101",
          name: "Executive Office Chair",
          description: "Ergonomic mesh back with lumbar support",
          hsnSac: "9401",
          quantity: 8,
          unit: "Nos",
          rate: 12500,
          discountType: "percentage",
          discountValue: 5,
          gstRate: 18,
          cgstAmount: 8550,
          sgstAmount: 8550,
          igstAmount: 0,
          amount: 95000,
          total: 112100,
          sortOrder: 1,
        },
        {
          id: "item_2",
          productId: "prod_102",
          name: "Modular Workstation Desk",
          description: "L-shaped desk with cable management",
          hsnSac: "9403",
          quantity: 6,
          unit: "Nos",
          rate: 18500,
          discountType: "fixed",
          discountValue: 1000,
          gstRate: 18,
          cgstAmount: 9450,
          sgstAmount: 9450,
          igstAmount: 0,
          amount: 105000,
          total: 123900,
          sortOrder: 2,
        },
        {
          id: "item_3",
          productId: "prod_103",
          name: "Storage Cabinet (3 Drawer)",
          description: "Steel body with soft close drawers",
          hsnSac: "9403",
          quantity: 4,
          unit: "Nos",
          rate: 9200,
          discountType: "percentage",
          discountValue: 0,
          gstRate: 18,
          cgstAmount: 3312,
          sgstAmount: 3312,
          igstAmount: 0,
          amount: 36800,
          total: 43424,
          sortOrder: 3,
        },
      ],

      // ---------- Summary ----------
      subtotal: 236800,
      discountTotal: 8500,
      cgstTotal: 21312,
      sgstTotal: 21312,
      igstTotal: 0,
      taxTotal: 42624,
      otherCharges: 0,
      roundOff: 0,
      grandTotal: 279424,
      totalInWords: "Two Lakh Seventy Nine Thousand Four Hundred Twenty Four Only",

      // ---------- Payment ----------
      showBankDetails: true,
      bankAccountId: "bank_01",
      bankName: "HDFC Bank",
      accountNumber: "50200012345678",
      ifsc: "HDFC0001234",
      accountHolderName: "Bigi Furniture Pvt Ltd",

      showUpiDetails: true,
      upiId: "bigi@hdfcbank",
      upiLinkedBank: "HDFC Bank",

      paymentTerms: "50% advance, balance on delivery",
      paymentInstructions: "Please mention Quotation Number in payment remarks",

      // ---------- Signature ----------
      signatureType: "simple",
      signatureUrl: null,
      signatureLabel: "Authorized Signatory",
      authorizedPerson: "Amit Sharma",
      designation: "Sales Manager",

      // ---------- Terms ----------
      terms: [
        "Prices are valid for 30 days from the date of quotation.",
        "Delivery will be made within 15-20 working days after confirmation.",
        "Warranty: 1 year on manufacturing defects.",
        "Taxes extra as applicable.",
        "Payment terms: 50% advance along with PO, balance before delivery.",
      ],

      // ---------- Meta ----------
      salesPersonId: "user_45",
      salesPersonName: "Priya Patel",
      templateId: null,

      // ---------- Linked ----------
      salesOrderId: null,
      invoiceId: null,

      // ---------- Audit ----------
      createdAt: "2026-09-10T10:30:00.000Z",
      updatedAt: "2026-09-12T14:22:00.000Z",
      createdBy: "user_12",
      updatedBy: "user_12",
    };

    return {
      data: {
        success: true,
        message: "Quotation fetched successfully",
        data: dummyQuotation,
      },
    };
  },

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