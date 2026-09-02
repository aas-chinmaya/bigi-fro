
"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui";

type PaymentReceiptActionsProps = {
  id: string;
  receiptNumber?: string;
  status?: string | null;
};

export default function PaymentReceiptActions({
  id,
}: PaymentReceiptActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="View money receipt"
        title="View money receipt"
        onClick={() =>
          router.push(
            `/sales/payment-receipt/${id}`,
          )
        }
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye className="size-4" />
      </Button>
    </div>
  );
}
