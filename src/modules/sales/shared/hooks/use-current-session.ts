







"use client";

import { useMemo } from "react";

// ============================================================
// TYPES
// ============================================================

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  avatar?: string | null;
}

export interface SessionData {
  user: SessionUser | null;
  business: SessionBusiness | null;
}

export interface SessionBusiness {
  id: string;
  name: string;
  legalName?: string | null;
  gstin?: string | null;
  pan?: string | null;
  phone?: string | null;
  email?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  stateCode?: string | null;
  pincode?: string | null;
  country: string;

  // Bank details
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankIFSC?: string | null;
  bankBranch?: string | null;

  // UPI
  upiId?: string | null;

  branchId?: string | null;
  branchName?: string | null;
}

export interface CurrentSession {
  user: SessionUser | null;
  business: SessionBusiness | null;
}

export interface CurrentSessionResponse {
  success: boolean;
  message: string;
  data: CurrentSession;
}

// ============================================================
// DUMMY RESPONSE
// ============================================================

const DUMMY_RESPONSE: CurrentSessionResponse = {
  success: true,
  message: "Session fetched successfully",
  data: {
    user: {
      id: "user_aas_001",
      name: "Chinmaya Das",
      email: "chinmaya@aas.technology",
      phone: "+91 98765 43210",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Chinmaya+Das",
    },

    business: {
      id: "aas-international",
      name: "AAS International",
      legalName: "AAS International Private Limited",

      gstin: "21AABCA1234A1Z5",
      pan: "AABCA1234A",

      phone: "+91 6742571111",
      email: "marketing@aas.technology",

      addressLine1: "Plot No. 52, 2nd Floor, Bapuji Nagar",
      addressLine2: "Bhubaneswar",
      city: "Bhubaneswar",
      state: "Odisha",
      stateCode: "21",
      pincode: "751009",
      country: "India",

      // Bank details
      bankName: "State Bank of India",
      bankAccountNumber: "123456789012",
      bankIFSC: "SBIN0001234",
      bankBranch: "Bhubaneswar Main Branch",

      // UPI
      upiId: "aasinternational@upi",

      branchId: "AASI-BR-001",
      branchName: "Bhubaneswar Head Office",
    },
  },
};

// ============================================================
// HOOK
// ============================================================

/**
 * useCurrentSession
 *
 * Currently returns dummy data.
 * When API is ready → just uncomment the real API part.
 */
export function useCurrentSession(): {
  data: CurrentSession | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
} {
  // ----------------------------------------------------------
  // CURRENT (Dummy)
  // ----------------------------------------------------------

  const data = useMemo(() => DUMMY_RESPONSE.data, []);

  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
  };

  // ----------------------------------------------------------
  // FUTURE (Real API) - Uncomment when ready
  // ----------------------------------------------------------

  /*
  const { data, isLoading, isError, error } =
    useGetCurrentSessionQuery();

  return {
    data: data?.data ?? null,
    isLoading,
    isError,
    error,
  };
  */
}