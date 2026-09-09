// "use client";

// import { useEffect, useState } from "react";
// import { businessService } from "../services/business.service";

// export interface UseBusinessesByUserReturn {
//   businesses: any[];
//   loading: boolean;
//   error: Error | null;
//   refetch: () => Promise<void>;
// }

// /**
//  * Custom hook to fetch businesses for the current user
//  * Calls the '/business/getBusinessesByUser' API endpoint
//  * 
//  * @param userRole - Optional user role to determine which endpoint to use
//  * @returns Object containing businesses array, loading state, error, and refetch function
//  */
// export function useBusinessesByUser(userRole?: string | null): UseBusinessesByUserReturn {
//   const [businesses, setBusinesses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   const fetchBusinesses = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await businessService.getBusinesses(userRole);
//       setBusinesses(data);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err : new Error("Failed to fetch businesses");
//       setError(errorMessage);
//       setBusinesses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBusinesses();
//   }, [userRole]);

//   const refetch = async () => {
//     await fetchBusinesses();
//   };

//   return {
//     businesses,
//     loading,
//     error,
//     refetch,
//   };
// }




// "use client";

// import { useMemo } from "react";
// import { useAppSelector } from "@/store/hooks";
// import { selectBusinessRecords, selectBusinessStatus, selectBusinessError } from "@/modules/business/store/businessSlice";

// export interface UseUserBusinessReturn {
//   user: any | null;
//   business: any | null;
//   loading: boolean;
//   error: string | null;
// }

// export function useUserBusiness(): UseUserBusinessReturn {
//   const user = useAppSelector((state: any) => state.auth.user);

//   const records = useAppSelector(selectBusinessRecords);
//   const status = useAppSelector(selectBusinessStatus);
//   const error = useAppSelector(selectBusinessError);

//   const business = useMemo(() => {
//     const list = records ?? [];
//     if (!list.length) return null;

//     for (const biz of list) {
//       const ownBranch = biz.branches?.find((b: any) => b.id === user?.branchId);
//       if (ownBranch) {
//         return { ...biz, branches: ownBranch }; // <-- single object here, not array
//       }
//     }

//     // no match found -> still return first business, but with its FIRST branch only
//     const first = list[0];
//     return first ? { ...first, branches: first.branches?.[1] ?? null } : null;
//   }, [records, user]);

//   return {
//     user,
//     business,
//     loading: status === "loading" || status === "idle",
//     error,
//   };
// }



"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectBusinessRecords, selectBusinessStatus, selectBusinessError } from "@/modules/business/store/businessSlice";

export interface UseUserBusinessReturn {
  user: any | null;
  business: any | null; // full business, branches = single object of user's own branch, or null
  loading: boolean;
  error: string | null;
}

export function useUserBusiness(): UseUserBusinessReturn {
  const user = useAppSelector((state: any) => state.auth.user);

  const records = useAppSelector(selectBusinessRecords);
  const status = useAppSelector(selectBusinessStatus);
  const error = useAppSelector(selectBusinessError);

  const business = useMemo(() => {
    if (!user?.branchId) return null;

    for (const biz of records ?? []) {
      const ownBranch = biz.branches?.find((b: any) => b.id === user.branchId);
      if (ownBranch) {
        return { ...biz, branches: ownBranch }; // single object, the user's real branch — no fallback
      }
    }

    return null; // no match -> null, not first business
  }, [records, user]);

  return {
    user,
    business,
    loading: status === "loading" || status === "idle",
    error,
  };
}