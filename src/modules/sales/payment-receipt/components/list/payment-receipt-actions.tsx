
"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui";

type PaymentReceiptActionsProps = {
  id: string;
  receiptNumber?: string;
  status?: string | null;
  businessId?: string;
};

export function PaymentReceiptActions({
  id,
  businessId,
}: PaymentReceiptActionsProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/sales/payment-receipt/${id}?businessId=${encodeURIComponent(businessId ?? "")}`);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="View money receipt"
        title="View money receipt"
        onClick={handleView}
        className="text-muted hover:bg-violet/10 hover:text-violet"
      >
        <Eye className="size-4" />
      </Button>
    </div>
  );
}