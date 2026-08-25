"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui";

type CashReceiptActionsProps = {
  id: string;
  receiptNo?: string;
  status?: string | null;
};

export default function CashReceiptActions({
  id,
  receiptNo,
  status,
}: CashReceiptActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      {/* VIEW */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="View cash receipt"
        title="View cash receipt"
        onClick={() =>
          router.push(
            `/sales/cash-receipt/${id}`,
          )
        }
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye className="size-4" />
      </Button>

      {/* EDIT */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Edit cash receipt"
        title="Edit cash receipt"
        onClick={() =>
          router.push(
            `/sales/cash-receipt/${id}/edit`,
          )
        }
        className="hover:bg-blue-50 hover:text-blue-600"
      >
        <Pencil className="size-4" />
      </Button>
    </div>
  );
}