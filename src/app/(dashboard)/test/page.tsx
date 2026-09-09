"use client";

import { useEffect } from "react";
import { useUserBusiness } from "@/modules/business/hooks/useBusinessesByUser";

export default function YourComponent() {
  const {
    user,
    business,
    loading,
    error,
  } = useUserBusiness();

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Business (own branch filtered):", business);
  }, [user, business]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>{/* your component */}</div>;
}