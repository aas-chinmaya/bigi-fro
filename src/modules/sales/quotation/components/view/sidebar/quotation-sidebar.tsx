

"use client";

import {
  Mail,
  Landmark,
  History,
  Settings,
  Palette,
  CreditCard,
  CheckCircle2,
  Link2,
} from "lucide-react";

import Accordion, { type AccordionSection } from "@/components/ui/accordion";
import type { Quotation } from "../../../types/quotation.types";

interface QuotationSidebarProps {
  quotation: Quotation;
}

export function QuotationSidebar({ quotation }: QuotationSidebarProps) {
  const sections: AccordionSection[] = [
    {
      id: "actions",
      title: "Actions",
      icon: Mail,
      color: "blue",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Actions — coming soon
        </div>
      ),
    },
    {
      id: "bank-details",
      title: "Bank Account Details",
      icon: Landmark,
      color: "emerald",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Bank details — coming soon
        </div>
      ),
    },
    {
      id: "activity",
      title: "Activity",
      icon: History,
      color: "violet",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Activity — coming soon
        </div>
      ),
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      color: "blue",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Settings — coming soon
        </div>
      ),
    },
    {
      id: "design",
      title: "Design",
      icon: Palette,
      color: "violet",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Design — coming soon
        </div>
      ),
    },
    {
      id: "payment",
      title: "Payment",
      icon: CreditCard,
      color: "emerald",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Payment — coming soon
        </div>
      ),
    },
    {
      id: "acceptance",
      title: "Acceptance",
      icon: CheckCircle2,
      color: "amber",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Acceptance — coming soon
        </div>
      ),
    },
    {
      id: "linked",
      title: "Linked Documents",
      icon: Link2,
      color: "rose",
      content: (
        <div className="py-2 text-sm text-muted-foreground">
          Linked Documents — coming soon
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Accordion sections={sections} defaultOpenId="actions" />
    </div>
  );
}