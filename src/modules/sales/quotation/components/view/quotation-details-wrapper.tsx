"use client";

import { useEffect, useState } from "react";
import { PanelRightClose, PanelRightOpen, X } from "lucide-react";

import QuotationActionsSidebar from "./quotation-actions-sidebar";
import QuotationPreview from "./quotation-preview";

export default function QuotationDetailsWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mobile/tablet always start closed.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mql.matches);
  }, []);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gray-50">
      {/* ===================== LEFT SIDE ===================== */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Left Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Sales</span>
              <span>/</span>
              <span>Quotation</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="text-sm font-semibold text-gray-900">A00001</h1>
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">
                SENT
              </span>
            </div>
          </div>

          {/* Mobile open button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition  hover:text-gray-800 lg:hidden"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>

        {/* Left Content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <QuotationPreview />
        </main>
      </div>

      {/* ===================== DESKTOP RIGHT SIDE (lg+) ===================== */}
      <div
        className={`
          relative hidden h-full shrink-0 flex-col border-l border-gray-200 bg-white transition-all duration-500 ease-in-out lg:flex
          ${sidebarOpen ? "w-[340px] xl:w-[360px]" : "w-12"}
        `}
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
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-all duration-300  hover:text-gray-800"
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
            <QuotationActionsSidebar />
          </div>
        ) : (
          // Collapsed rail: fills the remaining height (fixes the empty/blank
          // strip bug) and gives the user a hint of what's behind the toggle.
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-3 py-4 text-gray-400 transition  hover:text-gray-600"
          >
            <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-medium tracking-wide">
              Actions
            </span>
          </button>
        )}
      </div>

      {/* ===================== MOBILE / MD DRAWER (not full page) ===================== */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden"
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
          <h2 className="text-sm font-semibold text-gray-900">
            Quotation Settings
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition  hover:text-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <QuotationActionsSidebar />
        </div>
      </div>
    </div>
  );
}