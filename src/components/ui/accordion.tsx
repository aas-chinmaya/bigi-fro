"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

export type AccordionColor = "blue" | "emerald" | "violet" | "amber" | "rose";

const colorMap: Record<
  AccordionColor,
  { chip: string; icon: string; ring: string; bar: string }
> = {
  blue: {
    chip: "bg-blue-50",
    icon: "text-blue-600",
    ring: "ring-blue-100",
    bar: "bg-blue-500",
  },
  emerald: {
    chip: "bg-emerald-50",
    icon: "text-emerald-600",
    ring: "ring-emerald-100",
    bar: "bg-emerald-500",
  },
  violet: {
    chip: "bg-violet-50",
    icon: "text-violet-600",
    ring: "ring-violet-100",
    bar: "bg-violet-500",
  },
  amber: {
    chip: "bg-amber-50",
    icon: "text-amber-600",
    ring: "ring-amber-100",
    bar: "bg-amber-500",
  },
  rose: {
    chip: "bg-rose-50",
    icon: "text-rose-600",
    ring: "ring-rose-100",
    bar: "bg-rose-500",
  },
};

export interface AccordionSection {
  id: string;
  title: string;
  icon?: LucideIcon;
  color?: AccordionColor;
  content: ReactNode;
}

interface AccordionProps {
  sections: AccordionSection[];
  defaultOpenId?: string;
}

export default function Accordion({ sections, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="flex flex-col gap-2 p-3">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        const Icon = section.icon;
        const tone = colorMap[section.color ?? "blue"];

        return (
          <div
            key={section.id}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isOpen
                ? `border-transparent shadow-sm ring-1 ${tone.ring}`
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="flex w-full items-center gap-3 px-3 py-3 text-left"
            >
              {Icon && (
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.chip}`}
                >
                  <Icon className={`h-4 w-4 ${tone.icon}`} />
                </span>
              )}
              <span className="flex-1 text-sm font-medium text-gray-900">
                {section.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[minmax(0,1fr)]" : "grid-rows-[minmax(0,0fr)]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-gray-100 px-3 py-3">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}