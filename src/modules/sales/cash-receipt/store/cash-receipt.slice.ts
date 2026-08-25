import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { cashReceiptService } from "../services/cash-receipt.service";

import type {
  CashReceipt,
  CashReceiptListResponse,
  CashReceiptQueryParams,
  CreateCashReceiptPayload,
  UpdateCashReceiptPayload,
} from "../types/cash-receipt.types";

interface CashReceiptState {
  cashReceipts: CashReceipt[];
  selectedCashReceipt: CashReceipt | null;

  loading: boolean;
  error: string | null;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: CashReceiptState = {
  cashReceipts: [],
  selectedCashReceipt: null,

  loading: false,
  error: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchCashReceipts = createAsyncThunk<
  CashReceiptListResponse,
  CashReceiptQueryParams | undefined,
  { rejectValue: string }
>(
  "cashReceipt/fetchCashReceipts",
  async (params, { rejectWithValue }) => {
    try {
      return await cashReceiptService.getCashReceipts(
        params,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch cash receipts",
      );
    }
  },
);

export const fetchCashReceiptById = createAsyncThunk<
  CashReceipt,
  string,
  { rejectValue: string }
>(
  "cashReceipt/fetchCashReceiptById",
  async (id, { rejectWithValue }) => {
    try {
      return await cashReceiptService.getCashReceiptById(
        id,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch cash receipt",
      );
    }
  },
);

export const addCashReceipt = createAsyncThunk<
  CashReceipt,
  CreateCashReceiptPayload,
  { rejectValue: string }
>(
  "cashReceipt/addCashReceipt",
  async (payload, { rejectWithValue }) => {
    try {
      return await cashReceiptService.createCashReceipt(
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create cash receipt",
      );
    }
  },
);

export const editCashReceipt = createAsyncThunk<
  CashReceipt,
  {
    id: string;
    payload: UpdateCashReceiptPayload;
  },
  { rejectValue: string }
>(
  "cashReceipt/editCashReceipt",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await cashReceiptService.updateCashReceipt(
        id,
        payload,
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to update cash receipt",
      );
    }
  },
);

const cashReceiptSlice = createSlice({
  name: "cashReceipt",

  initialState,

  reducers: {
    clearSelectedCashReceipt: (state) => {
      state.selectedCashReceipt = null;
    },

    clearCashReceiptError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch all
      .addCase(
        fetchCashReceipts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchCashReceipts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.cashReceipts =
            action.payload.data;

          state.pagination =
            action.payload.pagination;
        },
      )

      .addCase(
        fetchCashReceipts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch cash receipts";
        },
      )

      // Fetch single
      .addCase(
        fetchCashReceiptById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchCashReceiptById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedCashReceipt =
            action.payload;
        },
      )

      .addCase(
        fetchCashReceiptById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch cash receipt";
        },
      )

      // Create
      .addCase(
        addCashReceipt.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        addCashReceipt.fulfilled,
        (state, action) => {
          state.loading = false;

          state.cashReceipts.unshift(
            action.payload,
          );

          state.selectedCashReceipt =
            action.payload;
        },
      )

      .addCase(
        addCashReceipt.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to create cash receipt";
        },
      )

      // Update
      .addCase(
        editCashReceipt.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        editCashReceipt.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.cashReceipts.findIndex(
              (item) =>
                item.id === action.payload.id,
            );

          if (index !== -1) {
            state.cashReceipts[index] =
              action.payload;
          }

          state.selectedCashReceipt =
            action.payload;
        },
      )

      .addCase(
        editCashReceipt.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to update cash receipt";
        },
      );
  },
});

export const {
  clearSelectedCashReceipt,
  clearCashReceiptError,
} = cashReceiptSlice.actions;

export default cashReceiptSlice.reducer;