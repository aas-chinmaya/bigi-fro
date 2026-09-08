
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { paymentReceiptService } from "../services/payment-receipt.service";

import type {
  PaymentReceipt,
  PaymentReceiptListResponse,
  PaymentReceiptQueryParams,
  CreatePaymentReceiptPayload,
  UpdatePaymentReceiptPayload,PaymentAdjustment,
  PaymentAdjustmentPayload,
} from "../types/payment-receipt.types";

// ==========================================================
// STATE
// ==========================================================

interface PaymentReceiptState {
  paymentReceipts: PaymentReceipt[];
  selectedPaymentReceipt: PaymentReceipt | null;

  paymentAdjustment: PaymentAdjustment | null;
  loading: boolean;
  error: string | null;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================================
// INITIAL STATE
// ==========================================================

const initialState: PaymentReceiptState = {
  paymentReceipts: [],
  selectedPaymentReceipt: null,
 paymentAdjustment:  null,
  loading: false,
  error: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// ==========================================================
// FETCH MONEY RECEIPTS
// ==========================================================

export const fetchPaymentReceipts = createAsyncThunk<
  PaymentReceiptListResponse,
  PaymentReceiptQueryParams | undefined,
  { rejectValue: string }
>(
  "paymentReceipt/fetchPaymentReceipts",
  async (params, { rejectWithValue }) => {
    try {
      return await paymentReceiptService.getPaymentReceipts(params);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch payment receipts",
      );
    }
  },
);

// ==========================================================
// FETCH PAYMENT RECEIPT BY ID
// ==========================================================

export const fetchPaymentReceiptById = createAsyncThunk<
  PaymentReceipt,
  { id: string; businessId?: string },   // ← change argument type
  { rejectValue: string }
>(
  "paymentReceipt/fetchPaymentReceiptById",
  async ({ id, businessId }, { rejectWithValue }) => {
    try {
      return await paymentReceiptService.getPaymentReceiptById(id, businessId);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch money receipt",
      );
    }
  },
);

// ==========================================================
// CREATE MONEY RECEIPT
// ==========================================================

export const addPaymentReceipt = createAsyncThunk<
  PaymentReceipt,
  CreatePaymentReceiptPayload,
  { rejectValue: string }
>(
  "paymentReceipt/addPaymentReceipt",
  async (payload, { rejectWithValue }) => {
    try {
      return await paymentReceiptService.createPaymentReceipt(
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create payment receipt",
      );
    }
  },
);

// ==========================================================
// UPDATE PAYMENT RECEIPT
// ==========================================================

export const editPaymentReceipt = createAsyncThunk<
  PaymentReceipt,
  {
    id: string;
    payload: UpdatePaymentReceiptPayload;
  },
  { rejectValue: string }
>(
  "paymentReceipt/editPaymentReceipt",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await paymentReceiptService.updatePaymentReceipt(
        id,
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to update payment receipt",
      );
    }
  },
);
// ==========================================================
// CREATE PAYMENT ADJUSTMENT
// ==========================================================

export const createPaymentAdjustment = createAsyncThunk<
  PaymentAdjustment,
  PaymentAdjustmentPayload,
  { rejectValue: string }
>(
  "paymentReceipt/createPaymentAdjustment",
  async (payload, { rejectWithValue }) => {
    try {
      return await paymentReceiptService.createPaymentAdjustment(
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create payment adjustment",
      );
    }
  },
);

// ==========================================================
// FETCH PAYMENT ADJUSTMENT BY ID
// ==========================================================

export const fetchPaymentAdjustmentById = createAsyncThunk<
  PaymentAdjustment,
  { id: string; businessId?: string },
  { rejectValue: string }
>(
  "paymentReceipt/fetchPaymentAdjustmentById",
  async ({ id, businessId }, { rejectWithValue }) => {
    try {
      return await paymentReceiptService.getPaymentAdjustmentById(
        id,
        businessId,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch payment adjustment",
      );
    }
  },
);
// ==========================================================
// SLICE
// ==========================================================

const paymentReceiptSlice = createSlice({
  name: "paymentReceipt",

  initialState,

  reducers: {
    // ------------------------------------------------------
    // CLEAR SELECTED PAYMENT RECEIPT
    // ------------------------------------------------------

    clearSelectedPaymentReceipt: (state) => {
      state.selectedPaymentReceipt = null;
    },

    // ------------------------------------------------------
    // CLEAR ERROR
    // ------------------------------------------------------

    clearPaymentReceiptError: (state) => {
      state.error = null;
    },
  },

  // ========================================================
  // ASYNC ACTIONS
  // ========================================================

  extraReducers: (builder) => {
    builder

      // ====================================================
      // FETCH PAYMENT RECEIPTS
      // ====================================================

      .addCase(
        fetchPaymentReceipts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchPaymentReceipts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.paymentReceipts =
            action.payload.data;

          state.pagination =
            action.payload.pagination;
        },
      )

      .addCase(
        fetchPaymentReceipts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch payment receipts";
        },
      )

      // ====================================================
      // FETCH PAYMENT RECEIPT BY ID
      // ====================================================

      .addCase(
        fetchPaymentReceiptById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchPaymentReceiptById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedPaymentReceipt =
            action.payload;
        },
      )

      .addCase(
        fetchPaymentReceiptById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch payment receipt";
        },
      )

      // ====================================================
      // CREATE MONEY RECEIPT
      // ====================================================

      .addCase(
        addPaymentReceipt.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        addPaymentReceipt.fulfilled,
        (state, action) => {
          state.loading = false;

          state.paymentReceipts.unshift(
            action.payload,
          );

          state.selectedPaymentReceipt =
            action.payload;
        },
      )

      .addCase(
        addPaymentReceipt.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to create payment receipt";
        },
      )

      // ====================================================
      // UPDATE PAYMENT RECEIPT
      // ====================================================

      .addCase(
        editPaymentReceipt.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        editPaymentReceipt.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.paymentReceipts.findIndex(
              (item) =>
                item.id === action.payload.id,
            );

          if (index !== -1) {
            state.paymentReceipts[index] =
              action.payload;
          }

          state.selectedPaymentReceipt =
            action.payload;
        },
      )

      .addCase(
        editPaymentReceipt.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to update payment receipt";
        },
      )
      
      // ====================================================
        // CREATE PAYMENT ADJUSTMENT
        // ====================================================

        .addCase(
          createPaymentAdjustment.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          },
        )

        .addCase(
          createPaymentAdjustment.fulfilled,
          (state, action) => {
            state.loading = false;

            state.paymentAdjustment =
              action.payload;
          },
        )

        .addCase(
          createPaymentAdjustment.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to create payment adjustment";
          },
        )

        // ====================================================
        // FETCH PAYMENT ADJUSTMENT BY ID
        // ====================================================

        .addCase(
          fetchPaymentAdjustmentById.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          },
        )

        .addCase(
          fetchPaymentAdjustmentById.fulfilled,
          (state, action) => {
            state.loading = false;

            state.paymentAdjustment =
              action.payload;
          },
        )

        .addCase(
          fetchPaymentAdjustmentById.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch payment adjustment";
          },
        )
      ;
  },
});

// ==========================================================
// ACTIONS
// ==========================================================

export const {
  clearSelectedPaymentReceipt,
  clearPaymentReceiptError,
} = paymentReceiptSlice.actions;

// ==========================================================
// REDUCER
// ==========================================================

export default paymentReceiptSlice.reducer;
