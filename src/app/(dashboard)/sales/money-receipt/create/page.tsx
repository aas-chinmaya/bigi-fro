"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import MoneyReceiptForm from "@/modules/sales/money-receipt/components/create/cash-receipt-form";

export default function CreateMoneyReceiptPage() {
  const router = useRouter();

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
            Create Money Receipt
          </h1>

          <p className="text-sm text-muted-foreground">
            Record a customer payment or advance receipt
          </p>
        </div>
      </div>

      {/* Form */}
      <MoneyReceiptForm />
    </div>
  );
}