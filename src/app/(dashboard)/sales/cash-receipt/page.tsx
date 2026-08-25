"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

import InvoiceTable from "@/modules/sales/invoice/components/list/invoice-table";

export default function CashReceiptListPage() {
  const router = useRouter();

  const {
    invoices,
    loading,
    getInvoices,
  } = useInvoiceQuery();

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

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
          onClick={() => router.push("/sales/cash-receipt/create")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Cash Receipt
        </Button>
      </div>

      {/* Cash Receipt List */}
      <InvoiceTable
        invoices={invoices}
        loading={loading}
      />
    </div>
  );
}