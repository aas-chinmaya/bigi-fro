"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  useGetQuotationByIdQuery,
  useUpdateQuotationStatusMutation,
  useDownloadQuotationPdfMutation,
} from "../../api/quotation.api";
import { notify } from "@/lib/toast";
import { QuotationViewHeader } from "./header/quotation-view-header";
import { QuotationPreview } from "./quotation-preview";
import { QuotationSidebar } from "./sidebar/quotation-sidebar";

interface QuotationViewProps {
  id: string;
}

export function QuotationView({ id }: QuotationViewProps) {
  const { data: response, isLoading, isError } = useGetQuotationByIdQuery(id, {
    skip: !id,
  });

  const quotation = response?.data;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [updateStatus, { isLoading: statusLoading }] =
    useUpdateQuotationStatusMutation();
  const [downloadPdf, { isLoading: pdfLoading }] =
    useDownloadQuotationPdfMutation();

  const handleDownload = async () => {
    if (!quotation?.id) return;
    try {
      const blob = await downloadPdf(quotation.id).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quotation.quotationNumber || "quotation"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify.success("PDF downloaded");
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      notify.error(
        e?.data?.message || e?.message || "Failed to download PDF",
      );
    }
  };

  const handleStatusChange = async (
    status:
      | "ACCEPTED"
      | "REJECTED"
      | "CANCELLED"
      | "SENT"
      | "FINALIZED"
      | "DRAFT",
    remarks?: string,
  ) => {
    if (!quotation?.id) return;
    try {
      const res = await updateStatus({
        id: quotation.id,
        data: { status, remarks },
      }).unwrap();
      notify.success(res.message || `Status updated to ${status}`);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      notify.error(
        e?.data?.message || e?.message || "Failed to update status",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError || !quotation) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <p className="text-destructive">Quotation not found</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden rounded-lg bg-surface">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <QuotationViewHeader
          quotation={quotation}
          onOpenSidebar={() => setSidebarOpen((o) => !o)}
          onStatusChange={handleStatusChange}
          statusLoading={statusLoading}
          onDownload={handleDownload}
          downloadLoading={pdfLoading}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <QuotationPreview quotation={quotation} />
        </main>
      </div>

      {/* Right drawer overlay — sm/md/lg, does not squeeze main */}
      <aside
        className={`absolute inset-y-0 right-0 z-50 flex w-[min(100%,300px)] flex-col border-l border-gray-200 bg-surface shadow-xl transition-transform duration-300 ease-in-out sm:w-[320px] md:w-[340px] ${
          sidebarOpen
            ? "translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-3 sm:px-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Quotation Activity
          </h2>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <QuotationSidebar quotation={quotation} />
        </div>
      </aside>
    </div>
  );
}
