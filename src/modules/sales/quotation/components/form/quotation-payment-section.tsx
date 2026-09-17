"use client";

import { useState, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Landmark, QrCode } from "lucide-react";

export function QuotationPaymentSection() {
  const [showBankOnQuotation, setShowBankOnQuotation] = useState(true);
  const [showUpiOnQuotation, setShowUpiOnQuotation] = useState(true);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Payment Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <PaymentBlock
          icon={<Landmark className="h-4 w-4" />}
          title="Bank Account Details"
          subtitle="NEFT, IMPS, CASH"
          showOnQuotation={showBankOnQuotation}
          onShowChange={setShowBankOnQuotation}
        >
          <div className="space-y-1.5 text-sm">
            <p className="font-medium">AAS International</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">Bank:</span>{" "}
                State Bank of India
              </span>
              <span>
                <span className="font-medium text-foreground">Acc. No:</span>{" "}
                123456789012
              </span>
              <span>
                <span className="font-medium text-foreground">IFSC:</span>{" "}
                SBIN0001234
              </span>
            </div>
          </div>
        </PaymentBlock>

        <PaymentBlock
          icon={<QrCode className="h-4 w-4" />}
          title="UPI Details"
          subtitle="GooglePay, PhonePe, BHIM UPI"
          showOnQuotation={showUpiOnQuotation}
          onShowChange={setShowUpiOnQuotation}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border">
              <QrCode className="h-14 w-14 text-foreground" />
            </div>

            <div className="min-w-0 flex-1 space-y-1 text-sm">
              <p className="font-medium">UPI</p>
              <p className="font-medium">paymentaasint@sbi</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Linked Bank Acc:
                </span>{" "}
                State Bank of India
              </p>
            </div>
          </div>
        </PaymentBlock>
      </CardContent>
    </Card>
  );
}

function PaymentBlock({
  icon,
  title,
  subtitle,
  showOnQuotation,
  onShowChange,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  showOnQuotation: boolean;
  onShowChange: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Show on Quotation
          </span>
          <Switch checked={showOnQuotation} onCheckedChange={onShowChange} />
        </div>
      </div>

      <Separator />

      <div className="px-4 py-3">{children}</div>
    </div>
  );
}