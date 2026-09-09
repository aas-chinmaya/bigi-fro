


"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceiptActionButtonProps {
  icon: LucideIcon;
  label: string;
  color?: "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";
  onClick?: () => void;
  disabled?: boolean;
}

const colorMap: Record<
  NonNullable<ReceiptActionButtonProps["color"]>,
  { icon: string; hover: string; active: string }
> = {
  blue: {
    icon: "text-blue-600",
    hover: "hover:bg-blue-50",
    active: "active:bg-blue-100",
  },
  violet: {
    icon: "text-violet-600",
    hover: "hover:bg-violet-50",
    active: "active:bg-violet-100",
  },
  emerald: {
    icon: "text-emerald-600",
    hover: "hover:bg-emerald-50",
    active: "active:bg-emerald-100",
  },
  amber: {
    icon: "text-amber-600",
    hover: "hover:bg-amber-50",
    active: "active:bg-amber-100",
  },
  rose: {
    icon: "text-rose-600",
    hover: "hover:bg-rose-50",
    active: "active:bg-rose-100",
  },
  slate: {
    icon: "text-slate-600",
    hover: "hover:bg-slate-50",
    active: "active:bg-slate-100",
  },
};

export default function ReceiptActionButton({
  icon: Icon,
  label,
  color = "slate",
  onClick,
  disabled = false,
}: ReceiptActionButtonProps) {
  const colors = colorMap[color];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
        colors.hover,
        colors.active,
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-gray-200/80 transition-shadow group-hover:shadow",
          colors.icon,
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </button>
  );
}