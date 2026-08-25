"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCashReceiptQuery } from "@/modules/sales/cash-receipt/hooks/use-cash-receipt-query";

import CashReceiptTable from "@/modules/sales/cash-receipt/components/list/cash-receipt-table";

export default function CashReceiptListPage() {
  const router = useRouter();

  const {
    cashReceipts,
    loading,
    pagination,
  } = useCashReceiptQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cash Receipts
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer cash receipts
          </p>
        </div>

        <Button
          onClick={() =>
            router.push(
              "/sales/cash-receipt/create",
            )
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Cash Receipt
        </Button>
      </div>

      {/* Cash Receipt List */}
      <CashReceiptTable
        cashReceipts={cashReceipts}
        loading={loading}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}