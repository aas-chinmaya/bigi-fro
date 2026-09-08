"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

import { usePaymentReceiptQuery } from "../../hooks/use-payment-receipt-query";
import ReceiptActionsSidebar from "./receipt-actions-sidebar";
import ReceiptPreview from "./receipt-preview";

interface ReceiptDetailsWrapperProps {
  id: string;
  businessId?: string;
}

export default function ReceiptDetailsWrapper({
  id,
  businessId,
}: ReceiptDetailsWrapperProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { paymentReceipt, loading, error } = usePaymentReceiptQuery(
    undefined,
    id,
    businessId,
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mql.matches);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error || !paymentReceipt) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-sm text-destructive">
          {error || "Money receipt not found."}
        </p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const status = (paymentReceipt.receiptStatus ?? "RECEIVED").toUpperCase();

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden rounded-lg">
      {/* LEFT SIDE */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex h-15 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/sales/payment-receipt")}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              title="Back to list"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>Sales</span>
                <span>/</span>
                <span>Payment Receipt</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <h1 className="text-sm font-semibold text-gray-900">
                  {paymentReceipt.receiptNumber ?? "—"}
                </h1>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                  {status}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:text-gray-800 lg:hidden"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>

        <main className="min-h-0 flex-1 ">
        {/* <main className="min-h-0 flex-1 overflow-y-auto"> */}
          <ReceiptPreview paymentReceipt={paymentReceipt} />
        </main>
      </div>

      {/* DESKTOP RIGHT SIDE */}
      <div
        className={`
           relative hidden min-h-full shrink-0 flex-col border-l border-gray-200 bg-white transition-all duration-500 ease-in-out lg:flex
          ${sidebarOpen ? "w-[340px] xl:w-[360px]" : "w-12"}
        `}
      >
        <div className="flex h-15 shrink-0 items-center justify-between border-b border-gray-100 px-3">
          {sidebarOpen && (
            <div className="min-w-0 pl-1">
              <h2 className="truncate text-sm font-semibold text-gray-900">
                Actions
              </h2>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="cursor-pointer ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-all duration-300 hover:text-gray-800"
          >
            <PanelRightClose
              className={`h-4 w-4 transition-transform duration-500 ease-in-out ${
                sidebarOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {sidebarOpen ? (
          <div className="flex-1 overflow-hidden">
            <ReceiptActionsSidebar paymentReceipt={paymentReceipt} />
          </div>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-3 py-4 text-gray-400 transition hover:text-gray-600"
          >
            <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-medium tracking-wide">
              Actions
            </span>
          </button>
        )}
      </div>

      {/* MOBILE DRAWER */}
      {sidebarOpen && (
        <div
          className="cursor-pointer absolute inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          absolute inset-y-0 right-0 z-50 flex w-[300px] flex-col bg-white shadow-xl transition-transform duration-500 ease-in-out sm:w-[340px]
          lg:hidden
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <h2 className="text-sm font-semibold text-gray-900">Actions</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ReceiptActionsSidebar paymentReceipt={paymentReceipt} />
        </div>
      </div>
    </div>
  );
}