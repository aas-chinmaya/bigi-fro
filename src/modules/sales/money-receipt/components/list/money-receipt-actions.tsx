
"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui";

type MoneyReceiptActionsProps = {
  id: string;
  receiptNo?: string;
  status?: string | null;
};

export default function MoneyReceiptActions({
  id,
}: MoneyReceiptActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      {/* View */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="View money receipt"
        title="View money receipt"
        onClick={() =>
          router.push(
            `/sales/money-receipt/${id}`,
          )
        }
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye className="size-4" />
      </Button>

      {/* Edit */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Edit money receipt"
        title="Edit money receipt"
        onClick={() =>
          router.push(
            `/sales/money-receipt/${id}/edit`,
          )
        }
        className="hover:bg-blue-50 hover:text-blue-600"
      >
        <Pencil className="size-4" />
      </Button>
    </div>
  );
}
