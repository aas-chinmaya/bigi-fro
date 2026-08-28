"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

import InvoiceView from "@/modules/sales/invoice/components/view/invoice-view";

export default function InvoiceViewPage() {
  const params = useParams<{ id: string }>();

  const {
    selectedInvoice,
    loading,
    error,
    getInvoiceById,
  } = useInvoiceQuery();

  useEffect(() => {
    if (!params.id) return;

    getInvoiceById(params.id);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Loading invoice...
      </div>
    );
  }

  if (error || !selectedInvoice) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        {error ?? "Invoice not found."}
      </div>
    );
  }
  return <InvoiceView invoice={selectedInvoice as any} />;
}