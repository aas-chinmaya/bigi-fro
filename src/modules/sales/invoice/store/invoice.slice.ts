import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { invoiceService } from "../service/invoice.service";

import type {
  InvoiceListItem,
} from "../types/invoice-list.types";

import type {
  InvoiceFormValues,
} from "../types/invoice-form.types";

import type {
  CreateDraftPayload,
  UpdateDraftPayload,
  FinalizeDraftPayload,
  CreateInvoicePayload,
} from "../types/invoice-api.types";

// ==========================================================
// API response helpers
// ==========================================================

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// ==========================================================
// Redux State
// ==========================================================

interface InvoiceState {
  // Invoice list
  invoices: InvoiceListItem[];

  // Pagination/meta for invoices
  invoicesMeta?: {
    page?: number;
    totalPages?: number;
    totalRecords?: number;
    pageSize?: number;
  };

  // Draft list
  drafts: InvoiceListItem[];
  // Pagination/meta for drafts
  draftsMeta?: {
    page?: number;
    totalPages?: number;
    totalRecords?: number;
    pageSize?: number;
  };

  // Selected invoice for view/edit
  selectedInvoice: InvoiceFormValues | null;

  // Selected draft for edit
  selectedDraft: InvoiceFormValues | null;

  // Global request state
  loading: boolean;

  // Error
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  invoicesMeta: undefined,
  drafts: [],
  draftsMeta: undefined,

  selectedInvoice: null,
  selectedDraft: null,

  loading: false,
  error: null,
};

// ==========================================================
// Error helper
// ==========================================================

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.message ??
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

// ==========================================================
// Response helper
// ==========================================================

function getResponseData<T>(
  response: unknown,
): T {
  return (response as ApiResponse<T>).data;
}

// ==========================================================
// Draft Thunks
// ==========================================================

export const createDraft = createAsyncThunk<
  unknown,
  CreateDraftPayload,
  { rejectValue: string }
>(
  "invoice/createDraft",
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.createDraft(data);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const fetchDrafts = createAsyncThunk<
  { items: InvoiceListItem[]; meta?: Record<string, any> } | InvoiceListItem[],
  Record<string, any> | undefined,
  { rejectValue: string }
>(
  "invoice/fetchDrafts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getDrafts(params);

      const payload = (response as any).data;

      let items: InvoiceListItem[] = [];
      let meta: Record<string, any> | undefined;

      if (Array.isArray(payload)) {
        items = payload;
      } else if (payload && Array.isArray(payload.data)) {
        items = payload.data;
        meta = payload.meta ?? payload.pagination;
      } else if (payload && Array.isArray(payload.items)) {
        items = payload.items;
        meta = payload.meta ?? payload.pagination;
      } else if (payload && payload.data && Array.isArray((payload.data as any).items)) {
        items = (payload.data as any).items;
        meta = (payload.data as any).meta ?? payload.data.meta ?? payload.meta ?? payload.pagination;
      } else if (payload && payload.data && Array.isArray(payload.data)) {
        items = payload.data;
        meta = payload.meta ?? payload.pagination;
      } else {
        items = payload.drafts ?? payload.results ?? payload.data ?? [];
        meta = payload.meta ?? payload.pagination;
      }

      return { items, meta };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchDraftById = createAsyncThunk<
  InvoiceFormValues,
  string,
  { rejectValue: string }
>(
  "invoice/fetchDraftById",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.getDraftById(id);

      return getResponseData<InvoiceFormValues>(
        response.data,
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const updateDraft = createAsyncThunk<
  InvoiceFormValues,
  {
    id: string;
    data: UpdateDraftPayload;
  },
  { rejectValue: string }
>(
  "invoice/updateDraft",
  async (
    { id, data },
    { rejectWithValue },
  ) => {
    try {
      const response =
        await invoiceService.updateDraft(
          id,
          data,
        );

      return getResponseData<InvoiceFormValues>(
        response,
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const deleteDraft = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "invoice/deleteDraft",
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteDraft(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const finalizeDraft = createAsyncThunk<
  unknown,
  {
    id: string;
    data?: FinalizeDraftPayload;
  },
  { rejectValue: string }
>(
  "invoice/finalizeDraft",
  async (
    { id, data },
    { rejectWithValue },
  ) => {
    try {
      const response =
        await invoiceService.finalizeDraft(
          id,
          data,
        );

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

// ==========================================================
// Invoice Thunks
// ==========================================================

export const createInvoice = createAsyncThunk<
  unknown,
  CreateInvoicePayload,
  { rejectValue: string }
>(
  "invoice/createInvoice",
  async (data, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.createInvoice(
          data,
        );

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const fetchInvoices = createAsyncThunk<
  { items: InvoiceListItem[]; meta?: Record<string, any> } | InvoiceListItem[],
  Record<string, any> | undefined,
  { rejectValue: string }
>(
  "invoice/fetchInvoices",
  async (params, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoices(params);

      // axios response -> response.data is the payload from server
      const payload = (response as any).data;

      // Common patterns:
      // 1) { data: items, meta: { ... } }
      // 2) { items: [...], meta: { ... } }
      // 3) [...] (array)

      let items: InvoiceListItem[] = [];
      let meta: Record<string, any> | undefined;

      if (Array.isArray(payload)) {
        items = payload;
      } else if (payload && Array.isArray(payload.data)) {
        items = payload.data;
        meta = payload.meta ?? payload.pagination;
      } else if (payload && Array.isArray(payload.items)) {
        items = payload.items;
        meta = payload.meta ?? payload.pagination;
      } else if (payload && payload.data && Array.isArray((payload.data as any).items)) {
        items = (payload.data as any).items;
        meta = (payload.data as any).meta ?? payload.data.meta ?? payload.meta ?? payload.pagination;
      } else if (payload && payload.data && Array.isArray(payload.data)) {
        items = payload.data;
        meta = payload.meta ?? payload.pagination;
      } else {
        // Fallback: try to read items from payload.invoices or payload.results
        items = payload.invoices ?? payload.results ?? payload.data ?? [];
        meta = payload.meta ?? payload.pagination;
      }

      return { items, meta };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchInvoiceById = createAsyncThunk<
  InvoiceFormValues,
  string,
  { rejectValue: string }
>(
  "invoice/fetchInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.getInvoiceById(id);

      return getResponseData<InvoiceFormValues>(
        response.data,
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const cancelInvoice = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>(
  "invoice/cancelInvoice",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.cancelInvoice(id);

      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

export const deleteInvoice = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "invoice/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error),
      );
    }
  },
);

// ==========================================================
// Slice
// ==========================================================

const invoiceSlice = createSlice({
  name: "invoice",

  initialState,

  reducers: {
    clearInvoiceError(state) {
      state.error = null;
    },

    clearSelectedInvoice(state) {
      state.selectedInvoice = null;
    },

    clearSelectedDraft(state) {
      state.selectedDraft = null;
    },

    resetInvoiceState() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // ======================================================
    // Draft List
    // ======================================================

    builder
      .addCase(fetchDrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          state.drafts = action.payload;
          state.draftsMeta = undefined;
        } else {
          state.drafts = action.payload.items || [];

          const meta = action.payload.meta;
          if (meta) {
            state.draftsMeta = {
              page: meta.page ?? meta.currentPage ?? meta.pageNumber,
              totalPages: meta.totalPages ?? meta.totalPagesCount ?? meta.pages,
              totalRecords: meta.totalRecords ?? meta.total ?? meta.count,
              pageSize: meta.pageSize ?? meta.perPage ?? meta.limit,
            };
          } else {
            state.draftsMeta = undefined;
          }
        }
      })

      .addCase(
        fetchDrafts.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to fetch drafts";
        },
      )

      // ====================================================
      // Draft By ID
      // ====================================================

      .addCase(
        fetchDraftById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchDraftById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedDraft =
            action.payload;
        },
      )

      .addCase(
        fetchDraftById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to fetch draft";
        },
      )

      // ====================================================
      // Create Draft
      // ====================================================

      .addCase(
        createDraft.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        createDraft.fulfilled,
        (state) => {
          state.loading = false;
        },
      )

      .addCase(
        createDraft.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to create draft";
        },
      )

      // ====================================================
      // Update Draft
      // ====================================================

      .addCase(
        updateDraft.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        updateDraft.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedDraft =
            action.payload;
        },
      )

      .addCase(
        updateDraft.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to update draft";
        },
      )

      // ====================================================
      // Delete Draft
      // ====================================================

      .addCase(
        deleteDraft.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        deleteDraft.fulfilled,
        (state, action) => {
          state.loading = false;

          state.drafts =
            state.drafts.filter(
              (draft) =>
                draft.id !== action.payload,
            );
        },
      )

      .addCase(
        deleteDraft.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to delete draft";
        },
      )

      // ====================================================
      // Finalize Draft
      // ====================================================

      .addCase(
        finalizeDraft.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        finalizeDraft.fulfilled,
        (state) => {
          state.loading = false;
        },
      )

      .addCase(
        finalizeDraft.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to finalize draft";
        },
      )

      // ====================================================
      // Invoice List
      // ====================================================

      .addCase(
        fetchInvoices.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;

        // action.payload may be either array (legacy) or { items, meta }
        if (Array.isArray(action.payload)) {
          state.invoices = action.payload;
          state.invoicesMeta = undefined;
        } else {
          state.invoices = action.payload.items || [];

          const meta = action.payload.meta;
          if (meta) {
            state.invoicesMeta = {
              page: meta.page ?? meta.currentPage ?? meta.pageNumber,
              totalPages: meta.totalPages ?? meta.totalPagesCount ?? meta.pages,
              totalRecords: meta.totalRecords ?? meta.total ?? meta.count,
              pageSize: meta.pageSize ?? meta.perPage ?? meta.limit,
            };
          } else {
            state.invoicesMeta = undefined;
          }
        }
      })

      .addCase(
        fetchInvoices.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to fetch invoices";
        },
      )

      // ====================================================
      // Invoice By ID
      // ====================================================

      .addCase(
        fetchInvoiceById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchInvoiceById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedInvoice =
            action.payload;
        },
      )

      .addCase(
        fetchInvoiceById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to fetch invoice";
        },
      )

      // ====================================================
      // Create Invoice
      // ====================================================

      .addCase(
        createInvoice.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        createInvoice.fulfilled,
        (state) => {
          state.loading = false;
        },
      )

      .addCase(
        createInvoice.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to create invoice";
        },
      )

      // ====================================================
      // Cancel Invoice
      // ====================================================

      .addCase(
        cancelInvoice.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        cancelInvoice.fulfilled,
        (state) => {
          state.loading = false;
        },
      )

      .addCase(
        cancelInvoice.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to cancel invoice";
        },
      )

      // ====================================================
      // Delete Invoice
      // ====================================================

      .addCase(
        deleteInvoice.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        deleteInvoice.fulfilled,
        (state, action) => {
          state.loading = false;

          state.invoices =
            state.invoices.filter(
              (invoice) =>
                invoice.id !== action.payload,
            );
        },
      )

      .addCase(
        deleteInvoice.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            "Failed to delete invoice";
        },
      );
  },
});

// ==========================================================
// Actions
// ==========================================================

export const {
  clearInvoiceError,
  clearSelectedInvoice,
  clearSelectedDraft,
  resetInvoiceState,
} = invoiceSlice.actions;

// ==========================================================
// Reducer
// ==========================================================

export default invoiceSlice.reducer;