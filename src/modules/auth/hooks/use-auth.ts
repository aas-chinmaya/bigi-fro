"use client";

import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  };
}