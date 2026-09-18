"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import PaymentReceiptTable from "@/modules/sales/payment-receipt/components/list/payment-receipt-table";

export default function PaymentReceiptListPage() {
  const router = useRouter();

  const handleCreate = useCallback(() => {
    router.push("/sales/payment-receipt/create");
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Receipts
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer payment receipts
          </p>
        </div>

        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Payment Receipt
        </Button>
      </div>

      {/* Payment Receipt List — table owns its own filters, paging & data */}
      <PaymentReceiptTable />
    </div>
  );
}
