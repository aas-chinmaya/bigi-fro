"use client";

import { useAppSelector } from "@/store/hooks";

export function useCurrentUser() {
  const user = useAppSelector((state) => state.auth.user);

  const businessRecords = useAppSelector(
    (state) => state.business.records
  );

  const business =
    businessRecords.length > 0
      ? businessRecords[0]
      : null;

  const auth = useAppSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    initialized: state.auth.initialized,
    error: state.auth.error,
  }));

  return {
    user,
    business,
    auth,
  };
}

export default useCurrentUser;