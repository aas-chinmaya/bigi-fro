

"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit,
  Mail,
  MessageCircle,
  PanelRightOpen,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type {
  Quotation,
  QuotationStatus,
} from "../../../types/quotation.types";

interface QuotationViewHeaderProps {
  quotation: Quotation;
  onOpenSidebar: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
  onStatusChange?: (
    status: "ACCEPTED" | "REJECTED" | "CANCELLED",
  ) => void;
}

const STATUS_CHANGEABLE: QuotationStatus[] = [
  "DRAFT",
  "SENT",
];

export function QuotationViewHeader({
  quotation,
  onOpenSidebar,
  onDownload,
  onEmail,
  onWhatsApp,
  onStatusChange,
}: QuotationViewHeaderProps) {
  const router = useRouter();

  const [sendOpen, setSendOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const canChangeStatus = STATUS_CHANGEABLE.includes(
    quotation.quotationStatus,
  );

  const handleEdit = () => {
    router.push(`/sales/quotation/${quotation.id}/edit`);
  };

  const handleStatusChange = (
    status: "ACCEPTED" | "REJECTED" | "CANCELLED",
  ) => {
    setStatusOpen(false);
    onStatusChange?.(status);
  };

  return (
    <header className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-surface px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          title="Back to quotations"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <h1 className="min-w-0 truncate text-sm font-semibold text-gray-900 sm:text-[15px]">
          {quotation.quotationNumber ?? "Quotation"}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {canChangeStatus && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setStatusOpen((open) => !open);
                setSendOpen(false);
              }}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              title="Change quotation status"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span className="hidden sm:inline">
                Change Status
              </span>
              <span className="sm:hidden">Status</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {statusOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleStatusChange("ACCEPTED")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  Accepted
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange("REJECTED")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <XCircle className="h-3.5 w-3.5 text-danger" />
                  Rejected
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange("CANCELLED")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <XCircle className="h-3.5 w-3.5 text-danger" />
                  Cancelled
                </button>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSendOpen((open) => !open);
              setStatusOpen(false);
            }}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            title="Send quotation"
          >
            <Mail className="h-3.5 w-3.5 text-info" />
            <span>Send</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {sendOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setSendOpen(false);
                  onEmail?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Mail className="h-3.5 w-3.5 text-info" />
                Send by Email
              </button>

              <button
                type="button"
                onClick={() => {
                  setSendOpen(false);
                  onWhatsApp?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <MessageCircle className="h-3.5 w-3.5 text-success" />
                Send by WhatsApp
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDownload}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          title="Download quotation"
        >
          <Download className="h-3.5 w-3.5 text-violet" />
          <span className="hidden sm:inline">Download</span>
        </button>

        <button
          type="button"
          onClick={handleEdit}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-white transition hover:bg-primary/90"
          title="Edit quotation"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <div className="mx-0.5 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          title="Open settings"
        >
          <PanelRightOpen className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
