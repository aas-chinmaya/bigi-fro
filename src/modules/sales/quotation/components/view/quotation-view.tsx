"use client";

import { useEffect, useState } from "react";
import { PanelRightClose, PanelRightOpen, X } from "lucide-react";
import { useGetQuotationByIdQuery } from "../../api/quotation.api";
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

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mql.matches);
  }, []);

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
    <div className="relative flex h-screen w-full overflow-hidden bg-surface rounded-lg">
      {/* LEFT SIDE */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <QuotationViewHeader
          quotation={quotation}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <QuotationPreview quotation={quotation} />
        </main>
      </div>

      {/* DESKTOP RIGHT SIDE */}
      <div
        className={`relative hidden h-full shrink-0 flex-col border-l border-gray-200 bg-surface transition-all duration-500 ease-in-out lg:flex ${
          sidebarOpen ? "w-[340px] xl:w-[360px]" : "w-12"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-3">
          {sidebarOpen && (
            <div className="min-w-0 pl-1">
              <h2 className="truncate text-sm font-semibold text-gray-900">
                Quotation Settings
              </h2>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-all duration-300 hover:text-gray-800"
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
            <QuotationSidebar quotation={quotation} />
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

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-muted/30 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`absolute inset-y-0 right-0 z-50 flex w-[300px] flex-col bg-surface shadow-xl transition-transform duration-500 ease-in-out sm:w-[340px] lg:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Quotation Settings
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <QuotationSidebar quotation={quotation} />
        </div>
      </div>
    </div>
  );
}