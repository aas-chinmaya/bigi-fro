"use client";

import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/editor";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import type { TaxType } from "../../types/quotation.types";
import { formatINR, amountInWords } from "../../utils/quotation-form.utils";
import { QuotationSignatureSection } from "./quotation-signature-section";
import { Landmark, QrCode } from "lucide-react";

const BANKS = [
  {
    id: "bank-1",
    label: "HDFC Bank Ltd. (5678)",
    name: "AAS International",
    bank: "HDFC Bank",
    accountNo: "****5678",
    ifsc: "HDFC0001234",
  },
];

const UPIS = [
  {
    id: "upi-1",
    label: "paymentaasint@sbi",
    handle: "paymentaasint@sbi",
    linkedBank: "State Bank of India",
  },
];

export function QuotationFooterSection() {
  const { control, setValue, watch } =
    useFormContext<QuotationFormValues>();

  const taxType = (useWatch({ control, name: "taxType" }) ??
    "INTRA_STATE") as TaxType;
  const isInter = taxType === "INTER_STATE";

  const taxableAmount = useWatch({ control, name: "taxableAmount" }) ?? 0;
  const discountAmount = useWatch({ control, name: "discountAmount" }) ?? 0;
  const cgstAmount = useWatch({ control, name: "cgstAmount" }) ?? 0;
  const sgstAmount = useWatch({ control, name: "sgstAmount" }) ?? 0;
  const igstAmount = useWatch({ control, name: "igstAmount" }) ?? 0;
  const roundOffAmount = useWatch({ control, name: "roundOffAmount" }) ?? 0;
  const grandTotal = useWatch({ control, name: "grandTotal" }) ?? 0;

  const terms = watch("termsAndConditions") ?? "";
  const notes = watch("notes") ?? "";

  const totalTax = isInter ? igstAmount : cgstAmount + sgstAmount;

  const hasBanks = BANKS.length > 0;
  const hasUpis = UPIS.length > 0;

  const [bankId, setBankId] = useState(hasBanks ? BANKS[0].id : "");
  const [upiId, setUpiId] = useState(hasUpis ? UPIS[0].id : "");
  const [showBank, setShowBank] = useState(true);
  const [showUpi, setShowUpi] = useState(true);
  const [roundOffOn, setRoundOffOn] = useState(true);

  const bank = useMemo(
    () => BANKS.find((b) => b.id === bankId) ?? null,
    [bankId],
  );
  const upi = useMemo(() => UPIS.find((u) => u.id === upiId) ?? null, [upiId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {hasBanks && (
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <Landmark className="size-4 text-slate-500" />
                  Bank
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Show on quotation</span>
                  <Switch checked={showBank} onCheckedChange={setShowBank} />
                </div>
              </div>
              <Select value={bankId} onValueChange={setBankId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showBank && bank && (
                <p className="mt-2 text-xs text-slate-500">
                  {bank.name} · {bank.bank} · {bank.accountNo} · {bank.ifsc}
                </p>
              )}
            </div>
          )}

          {hasUpis && (
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <QrCode className="size-4 text-slate-500" />
                  UPI
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Show on quotation</span>
                  <Switch checked={showUpi} onCheckedChange={setShowUpi} />
                </div>
              </div>
              <Select value={upiId} onValueChange={setUpiId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select UPI" />
                </SelectTrigger>
                <SelectContent>
                  {UPIS.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showUpi && upi && (
                <p className="mt-2 text-xs text-slate-500">
                  {upi.handle} · Linked {upi.linkedBank}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Live summary */}
        <div className="space-y-2 text-sm lg:col-span-2">
          <SumRow label="Taxable" value={formatINR(taxableAmount)} />
          {discountAmount > 0 && (
            <SumRow label="Discount" value={`−${formatINR(discountAmount)}`} muted />
          )}
          {isInter ? (
            <SumRow label="IGST" value={formatINR(igstAmount)} />
          ) : (
            <>
              <SumRow label="CGST" value={formatINR(cgstAmount)} />
              <SumRow label="SGST" value={formatINR(sgstAmount)} />
            </>
          )}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Round off</span>
              <Switch
                checked={roundOffOn}
                onCheckedChange={(v) => {
                  setRoundOffOn(v);
                  if (!v) setValue("roundOffAmount", 0, { shouldDirty: true });
                }}
              />
            </div>
            <span className="tabular-nums text-slate-800">
              {formatINR(roundOffOn ? roundOffAmount : 0)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="text-base font-semibold text-slate-900">Grand total</span>
            <span className="text-lg font-semibold tabular-nums text-slate-900">
              ₹ {formatINR(grandTotal)}
            </span>
          </div>
          <p className="text-xs leading-snug text-slate-500">
            {amountInWords(grandTotal)}
          </p>
          <p className="text-[11px] text-slate-400">
            Tax · {isInter ? "IGST" : "CGST + SGST"} · {formatINR(totalTax)}
          </p>
        </div>
      </div>

      {/* Full width rich text */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-slate-600">Terms & conditions</Label>
          <div className="w-full rounded-md border border-slate-200 [&_.ProseMirror]:min-h-[56px] [&_.ProseMirror]:max-h-[120px] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none">
            <RichTextEditor
              value={terms || ""}
              onChange={(value) =>
                setValue("termsAndConditions", value, { shouldDirty: true })
              }
              placeholder="Payment terms, delivery, validity…"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-slate-600">Internal notes</Label>
          <div className="w-full rounded-md border border-slate-200 [&_.ProseMirror]:min-h-[48px] [&_.ProseMirror]:max-h-[100px] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none">
            <RichTextEditor
              value={notes || ""}
              onChange={(value) =>
                setValue("notes", value, { shouldDirty: true })
              }
              placeholder="Internal only…"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <QuotationSignatureSection />
      </div>
    </div>
  );
}

function SumRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={muted ? "text-slate-400" : "text-slate-600"}>{label}</span>
      <span className="tabular-nums text-slate-800">{value}</span>
    </div>
  );
}
