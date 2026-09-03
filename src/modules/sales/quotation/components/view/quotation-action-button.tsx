"use client";

import { LucideIcon } from "lucide-react";
import type { AccordionColor } from "@/components/ui/accordion";

const colorMap: Record<AccordionColor, { chip: string; icon: string }> = {
  blue: { chip: "bg-blue-50 group-hover:bg-blue-100", icon: "text-blue-600" },
  emerald: {
    chip: "bg-emerald-50 group-hover:bg-emerald-100",
    icon: "text-emerald-600",
  },
  violet: {
    chip: "bg-violet-50 group-hover:bg-violet-100",
    icon: "text-violet-600",
  },
  amber: {
    chip: "bg-amber-50 group-hover:bg-amber-100",
    icon: "text-amber-600",
  },
  rose: { chip: "bg-rose-50 group-hover:bg-rose-100", icon: "text-rose-600" },
};

interface QuotationActionButtonProps {
  icon: LucideIcon;
  label: string;
  color?: AccordionColor;
  onClick?: () => void;
}

export default function QuotationActionButton({
  icon: Icon,
  label,
  color = "blue",
  onClick,
}: QuotationActionButtonProps) {
  const tone = colorMap[color];

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${tone.chip}`}
      >
        <Icon className={`h-4 w-4 ${tone.icon}`} />
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}