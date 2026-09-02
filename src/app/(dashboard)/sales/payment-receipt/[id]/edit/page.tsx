"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import PaymentReceiptEditForm from "@/modules/sales/payment-receipt/components/edit/payment-receipt-edit-form";

export default function EditPaymentReceiptPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Payment Receipt
          </h1>

          <p className="text-sm text-muted-foreground">
            Update payment receipt information
          </p>
        </div>
      </div>

      <PaymentReceiptEditForm id={id} />
    </div>
  );
}