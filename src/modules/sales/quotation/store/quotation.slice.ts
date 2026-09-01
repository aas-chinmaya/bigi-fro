import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { quotationService } from "../services/quotation.service";

import type {
  Quotation,
  QuotationCreatePayload,
  QuotationFilters,
  QuotationListItem,
  QuotationListParams,
  QuotationUpdatePayload,
} from "../types/quotation.types";

interface QuotationState {
  quotations: QuotationListItem[];
  selectedQuotation: Quotation | null;

  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;

  filters: QuotationFilters;

  loading: boolean;
  detailsLoading: boolean;
  saving: boolean;
  deleting: boolean;

  error: string | null;
}

const initialState: QuotationState = {
  quotations: [{
          id: "1",
          quotationNumber: "QT-0001",
          quotationDate: "2026-08-25",
          validUntil: "2026-09-24",
          customerId: "CUST-001",
          customerName: "ABC Traders",
          quotationType: "B2B",
          status: "Draft",
          currency: "INR",
          grandTotal: 11300,
        },
        {
          id: "2",
          quotationNumber: "QT-0002",
          quotationDate: "2026-08-24",
          validUntil: "2026-09-23",
          customerId: "CUST-002",
          customerName: "XYZ Enterprises",
          quotationType: "B2B",
          status: "Sent",
          currency: "INR",
          grandTotal: 28500,
        },],

  // quotations: [],
  selectedQuotation: null,

  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,

  filters: {},

  loading: false,
  detailsLoading: false,
  saving: false,
  deleting: false,

  error: null,
};

// ---------------------------------------------------------
// Async Thunks
// ---------------------------------------------------------

export const fetchQuotations = createAsyncThunk(
  "quotation/fetchQuotations",
  async (params: QuotationListParams | undefined, { rejectWithValue }) => {
    try {
      return await quotationService.getQuotations(params);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch quotations",
      );
    }
  },
);

export const fetchQuotationById = createAsyncThunk(
  "quotation/fetchQuotationById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await quotationService.getQuotationById(id);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch quotation",
      );
    }
  },
);

export const createQuotation = createAsyncThunk(
  "quotation/createQuotation",
  async (payload: QuotationCreatePayload, { rejectWithValue }) => {
    try {
      return await quotationService.createQuotation(payload);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create quotation",
      );
    }
  },
);

export const updateQuotation = createAsyncThunk(
  "quotation/updateQuotation",
  async (
    { id, payload }: { id: string; payload: QuotationUpdatePayload },
    { rejectWithValue },
  ) => {
    try {
      return await quotationService.updateQuotation(id, payload);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update quotation",
      );
    }
  },
);

export const deleteQuotation = createAsyncThunk(
  "quotation/deleteQuotation",
  async (id: string, { rejectWithValue }) => {
    try {
      await quotationService.deleteQuotation(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete quotation",
      );
    }
  },
);

// ---------------------------------------------------------
// Slice
// ---------------------------------------------------------

const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<QuotationFilters>) {
      state.filters = action.payload;
      state.page = 1;
    },

    clearFilters(state) {
      state.filters = {};
      state.page = 1;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },

    clearSelectedQuotation(state) {
      state.selectedQuotation = null;
    },

    clearQuotationError(state) {
      state.error = null;
    },

    resetQuotationState() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Paginated
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data ?? action.payload;

        state.quotations = payload?.data ?? [];
        state.page = payload?.page ?? 1;
        state.limit = payload?.limit ?? 10;
        state.totalItems = payload?.totalItems ?? 0;
        state.totalPages = payload?.totalPages ?? 0;
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch By ID
      .addCase(fetchQuotationById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedQuotation =
          action.payload?.data ?? action.payload ?? null;
      })
      .addCase(fetchQuotationById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createQuotation.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.saving = false;
        state.selectedQuotation =
          action.payload?.data ?? action.payload ?? null;
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateQuotation.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.saving = false;
        state.selectedQuotation =
          action.payload?.data ?? action.payload ?? null;
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteQuotation.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.deleting = false;
        const deletedId = action.payload;

        state.quotations = state.quotations.filter(
          (q) => q.id !== deletedId,
        );

        if (state.selectedQuotation?.id === deletedId) {
          state.selectedQuotation = null;
        }

        state.totalItems = Math.max(0, state.totalItems - 1);
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  clearSelectedQuotation,
  clearQuotationError,
  resetQuotationState,
} = quotationSlice.actions;

export default quotationSlice.reducer;