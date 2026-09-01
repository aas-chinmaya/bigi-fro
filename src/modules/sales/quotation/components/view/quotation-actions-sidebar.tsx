

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Mail,
  Share2,
  Download,
  Printer,
  Landmark,
  History,
} from "lucide-react";

import Accordion, { type AccordionSection } from "@/components/ui/accordion";
import ToggleSwitch from "@/components/ui/toggle-switch";
import QuotationActionButton from "./quotation-action-button";
import QuotationActivityItem from "./quotation-activity-item";

const activity = [
  { title: "Quotation sent to customer", timestamp: "Today, 10:42 AM" },
  { title: "PDF generated", timestamp: "Today, 10:41 AM" },
  { title: "Quotation created by Manuuu", timestamp: "Yesterday, 4:15 PM" },
];

export default function QuotationActionsSidebar() {
  const router = useRouter();
  const [showBankDetails, setShowBankDetails] = useState(true);

  const sections: AccordionSection[] = [
    {
      id: "actions",
      title: "Actions",
      icon: Mail,
      color: "blue",
      content: (
        <div className="flex flex-col gap-0.5">
          <QuotationActionButton
            icon={Pencil}
            label="Edit"
            color="rose"
            onClick={() => router.push("/sales/quotation/1/edit")}
          />
          <QuotationActionButton icon={Mail} label="Email" color="blue" />
          <QuotationActionButton icon={Share2} label="Share" color="violet" />
          <QuotationActionButton icon={Download} label="Download PDF" color="emerald" />
          <QuotationActionButton icon={Printer} label="Print" color="amber" />
        </div>
      ),
    },
    {
      id: "bank-details",
      title: "Bank Account Details",
      icon: Landmark,
      color: "emerald",
      content: (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600">
            Show bank details in PDF
          </span>
          <ToggleSwitch
            checked={showBankDetails}
            onChange={setShowBankDetails}
            label="Show bank details in PDF"
          />
        </div>
      ),
    },
    {
      id: "activity",
      title: "Activity",
      icon: History,
      color: "violet",
      content: (
        <div className="flex flex-col pt-1">
          {activity.map((item, index) => (
            <QuotationActivityItem
              key={item.title}
              title={item.title}
              timestamp={item.timestamp}
              isLast={index === activity.length - 1}
            />
          ))}
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