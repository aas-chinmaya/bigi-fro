


"use client";

import { useState } from "react";

import CustomerSearchSelect, {
  type SelectedCustomer,
} from "@/modules/sales/shared/components/customer-search-select";

export default function CustomerTestPage() {
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  return (
        <CustomerSearchSelect
          onSelect={setSelectedCustomer}
        />

      
   
  );
}