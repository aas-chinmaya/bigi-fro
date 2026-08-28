
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { moneyReceiptService } from "../services/money-receipt.service";

import type {
  MoneyReceipt,
  MoneyReceiptListResponse,
  MoneyReceiptQueryParams,
  CreateMoneyReceiptPayload,
  UpdateMoneyReceiptPayload,
} from "../types/money-receipt.types";

// ==========================================================
// STATE
// ==========================================================

interface MoneyReceiptState {
  moneyReceipts: MoneyReceipt[];
  selectedMoneyReceipt: MoneyReceipt | null;

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

const initialState: MoneyReceiptState = {
  moneyReceipts: [],
  selectedMoneyReceipt: null,

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

export const fetchMoneyReceipts = createAsyncThunk<
  MoneyReceiptListResponse,
  MoneyReceiptQueryParams | undefined,
  { rejectValue: string }
>(
  "moneyReceipt/fetchMoneyReceipts",
  async (params, { rejectWithValue }) => {
    try {
      return await moneyReceiptService.getMoneyReceipts(params);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch money receipts",
      );
    }
  },
);

// ==========================================================
// FETCH MONEY RECEIPT BY ID
// ==========================================================

export const fetchMoneyReceiptById = createAsyncThunk<
  MoneyReceipt,
  string,
  { rejectValue: string }
>(
  "moneyReceipt/fetchMoneyReceiptById",
  async (id, { rejectWithValue }) => {
    try {
      return await moneyReceiptService.getMoneyReceiptById(id);
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

export const addMoneyReceipt = createAsyncThunk<
  MoneyReceipt,
  CreateMoneyReceiptPayload,
  { rejectValue: string }
>(
  "moneyReceipt/addMoneyReceipt",
  async (payload, { rejectWithValue }) => {
    try {
      return await moneyReceiptService.createMoneyReceipt(
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create money receipt",
      );
    }
  },
);

// ==========================================================
// UPDATE MONEY RECEIPT
// ==========================================================

export const editMoneyReceipt = createAsyncThunk<
  MoneyReceipt,
  {
    id: string;
    payload: UpdateMoneyReceiptPayload;
  },
  { rejectValue: string }
>(
  "moneyReceipt/editMoneyReceipt",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await moneyReceiptService.updateMoneyReceipt(
        id,
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to update money receipt",
      );
    }
  },
);

// ==========================================================
// SLICE
// ==========================================================

const moneyReceiptSlice = createSlice({
  name: "moneyReceipt",

  initialState,

  reducers: {
    // ------------------------------------------------------
    // CLEAR SELECTED MONEY RECEIPT
    // ------------------------------------------------------

    clearSelectedMoneyReceipt: (state) => {
      state.selectedMoneyReceipt = null;
    },

    // ------------------------------------------------------
    // CLEAR ERROR
    // ------------------------------------------------------

    clearMoneyReceiptError: (state) => {
      state.error = null;
    },
  },

  // ========================================================
  // ASYNC ACTIONS
  // ========================================================

  extraReducers: (builder) => {
    builder

      // ====================================================
      // FETCH MONEY RECEIPTS
      // ====================================================

      .addCase(
        fetchMoneyReceipts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchMoneyReceipts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.moneyReceipts =
            action.payload.data;

          state.pagination =
            action.payload.pagination;
        },
      )

      .addCase(
        fetchMoneyReceipts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch money receipts";
        },
      )

      // ====================================================
      // FETCH MONEY RECEIPT BY ID
      // ====================================================

      .addCase(
        fetchMoneyReceiptById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchMoneyReceiptById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedMoneyReceipt =
            action.payload;
        },
      )

      .addCase(
        fetchMoneyReceiptById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch money receipt";
        },
      )

      // ====================================================
      // CREATE MONEY RECEIPT
      // ====================================================

      .addCase(
        addMoneyReceipt.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        addMoneyReceipt.fulfilled,
        (state, action) => {
          state.loading = false;

          state.moneyReceipts.unshift(
            action.payload,
          );

          state.selectedMoneyReceipt =
            action.payload;
        },
      )

      .addCase(
        addMoneyReceipt.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to create money receipt";
        },
      )

      // ====================================================
      // UPDATE MONEY RECEIPT
      // ====================================================

      .addCase(
        editMoneyReceipt.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        editMoneyReceipt.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.moneyReceipts.findIndex(
              (item) =>
                item.id === action.payload.id,
            );

          if (index !== -1) {
            state.moneyReceipts[index] =
              action.payload;
          }

          state.selectedMoneyReceipt =
            action.payload;
        },
      )

      .addCase(
        editMoneyReceipt.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to update money receipt";
        },
      );
  },
});

// ==========================================================
// ACTIONS
// ==========================================================

export const {
  clearSelectedMoneyReceipt,
  clearMoneyReceiptError,
} = moneyReceiptSlice.actions;

// ==========================================================
// REDUCER
// ==========================================================

export default moneyReceiptSlice.reducer;
