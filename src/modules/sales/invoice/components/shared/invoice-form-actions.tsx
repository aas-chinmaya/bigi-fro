"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// ==========================================================
// INVOICE FORM ACTIONS
//
// Same 3-button footer used by Create ("Reset / Save Draft /
// Save invoice") and Edit ("Discard changes / Update Draft /
// Finalize invoice") — only the labels, icons, and handlers
// differ, so the bar itself is shared. Visual output is
// unchanged (same classNames, same layout).
// ==========================================================

interface InvoiceFormActionsProps {
  resetLabel: string;
  resetIcon: LucideIcon;
  onReset: () => void;

  secondaryLabel: string;
  secondaryIcon: LucideIcon;
  onSecondary: () => void;

  submitLabel: string;
  submitIcon: LucideIcon;
}

export default function InvoiceFormActions({
  resetLabel,
  resetIcon: ResetIcon,
  onReset,
  secondaryLabel,
  secondaryIcon: SecondaryIcon,
  onSecondary,
  submitLabel,
  submitIcon: SubmitIcon,
}: InvoiceFormActionsProps) {
  return (
    <div className="border-t border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        {/* RESET */}
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="gap-2"
        >
          <ResetIcon className="size-4" />
          {resetLabel}
        </Button>

        {/* SECONDARY (save draft / update draft) */}
        <Button
          type="button"
          variant="outline"
          onClick={onSecondary}
          className="gap-2"
        >
          <SecondaryIcon className="size-4" />
          {secondaryLabel}
        </Button>

        {/* SUBMIT (create / finalize) */}
        <Button type="submit" className="gap-2">
          <SubmitIcon className="size-4" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
