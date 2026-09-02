"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {  usePaymentReceiptQuery } from "@/modules/sales/payment-receipt/hooks/use-payment-receipt-query";

import PaymentReceiptTable from "@/modules/sales/payment-receipt/components/list/payment-receipt-table";

export default function PaymentReceiptListPage() {
  const router = useRouter();

  const {
    paymentReceipts,
    loading,
    pagination,
  } = usePaymentReceiptQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Receipts
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage customer payment receipts
          </p>
        </div>

        <Button
          onClick={() =>
            router.push(
              "/sales/payment-receipt/create",
            )
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Payment Receipt
        </Button>
      </div>

      {/* Payment Receipt List */}
      <PaymentReceiptTable
        paymentReceipts={paymentReceipts}
        loading={loading}
        page={pagination?.page ||1}
        totalPages={pagination?.totalPages}
      />
    </div>
  );
}