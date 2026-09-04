"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {  usePaymentReceiptQuery } from "@/modules/sales/payment-receipt/hooks/use-payment-receipt-query";

import PaymentReceiptTable from "@/modules/sales/payment-receipt/components/list/payment-receipt-table";

export default function PaymentReceiptListPage() {
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [period, setPeriod] = useState<string>("all");

  const getDateRange = (period: string) => {
    const now = new Date();
    const end = now.toISOString();

    if (period === "all") return {} as any;

    const startDate = new Date(now);

    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "year":
        startDate.setMonth(0, 0);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        return {} as any;
    }

    return {
      fromDate: startDate.toISOString(),
      toDate: end,
    } as any;
  };

  const params = useMemo(() => {
    const range = getDateRange(period);

    return {
      page,
      limit,
      search: search || undefined,
      status: status || undefined,
      ...range,
    };
  }, [page, limit, search, status, period]);

  const {
    paymentReceipts,
    loading,
    pagination,
  } = usePaymentReceiptQuery(params);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, period]);

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
        page={page}
        totalPages={pagination?.totalPages}
        onPageChange={(p) => setPage(p)}
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        period={period}
        onPeriodChange={setPeriod}
      />
    </div>
  );
}