"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {  useMoneyReceiptQuery } from "@/modules/sales/money-receipt/hooks/use-money-receipt-query";

import CashReceiptTable from "@/modules/sales/money-receipt/components/list/money-receipt-table";

export default function MoneyReceiptListPage() {
  const router = useRouter();

  const {
    moneyReceipts,
    loading,
    pagination,
  } = useMoneyReceiptQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Money Receipts
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer money receipts
          </p>
        </div>

        <Button
          onClick={() =>
            router.push(
              "/sales/money-receipt/create",
            )
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Money Receipt
        </Button>
      </div>

      {/* Money Receipt List */}
      <CashReceiptTable
        moneyReceipts={moneyReceipts}
        loading={loading}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}