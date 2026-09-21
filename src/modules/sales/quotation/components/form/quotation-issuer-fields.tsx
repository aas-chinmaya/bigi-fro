



"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import {
  Building2,
  Calendar,
  FileText,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";

function join(...parts: Array<string | null | undefined>) {
  return parts
    .map((p) => (p || "").trim())
    .filter(Boolean)
    .join(", ");
}

export function QuotationIssuerFields() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const name = useWatch({
    control,
    name: "businessName",
  });

  const legal = useWatch({
    control,
    name: "businessLegalName",
  });

  const gstin = useWatch({
    control,
    name: "businessGSTIN",
  });

  const phone = useWatch({
    control,
    name: "businessPhone",
  });

  const email = useWatch({
    control,
    name: "businessEmail",
  });

  const a1 = useWatch({
    control,
    name: "businessAddressLine1",
  });

  const a2 = useWatch({
    control,
    name: "businessAddressLine2",
  });

  const city = useWatch({
    control,
    name: "businessCity",
  });

  const state = useWatch({
    control,
    name: "businessState",
  });

  const pincode = useWatch({
    control,
    name: "businessPincode",
  });

  const country = useWatch({
    control,
    name: "businessCountry",
  });

  const showBankDetails = useWatch({
    control,
    name: "showBankDetails",
  });

  const showUPIDetails = useWatch({
    control,
    name: "showUPIDetails",
  });

  const bankName = useWatch({
    control,
    name: "businessBankName",
  });

  const accountNumber = useWatch({
    control,
    name: "businessBankAccountNumber",
  });

  const ifsc = useWatch({
    control,
    name: "businessBankIFSC",
  });

  const financialYear = useWatch({
    control,
    name: "financialYear",
  });
  const quotationDate = useWatch({
    control,
    name: "quotationDate",
  });

  const upiId = useWatch({
    control,
    name: "businessUPIId",
  });

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <Calendar className="size-3" />
          Quotation date
        </div>
        <p className="text-sm font-medium text-slate-900">
          {quotationDate
            ? new Date(quotationDate + (quotationDate.includes("T") ? "" : "T12:00:00")).toLocaleDateString(
                "en-IN",
                { day: "2-digit", month: "short", year: "numeric" },
              )
            : "—"}
        </p>
      </div>

      {/* Due Date */}
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <Calendar className="size-3.5 text-slate-400" />
          Due date
          <span className="text-red-500">*</span>
        </Label>

        <Input
          type="date"
          className="h-9"
          {...register("validUntil")}
        />

        {errors.validUntil && (
          <p className="text-[11px] text-red-500">
            {errors.validUntil.message}
          </p>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Financial year
        </div>
        <p className="text-sm font-medium text-slate-900">
          {financialYear || "—"}
        </p>
      </div>

      {/* Business */}
      <Block
        icon={<Building2 className="size-3.5" />}
        label="Business"
        value={name || "—"}
        strong
      />

      {/* Legal Name */}
      {legal ? (
        <Block
          label="Legal name"
          value={legal}
        />
      ) : null}

      {/* GSTIN */}
      <Block
        icon={<FileText className="size-3.5" />}
        label="GSTIN"
        value={gstin || "—"}
      />

      {/* Phone */}
      <Block
        icon={<Phone className="size-3.5" />}
        label="Phone"
        value={phone || "—"}
      />

      {/* Email */}
      <Block
        icon={<Mail className="size-3.5" />}
        label="Email"
        value={email || "—"}
      />

      {/* Payment Details */}
      <div className="space-y-3 border-t border-slate-100 pt-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Payment details
        </div>

        {/* Toggles - Always Visible */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Bank Toggle */}
          <div className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Landmark className="size-3.5 shrink-0 text-slate-400" />

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-700">
                  Bank details
                </p>

                <p className="truncate text-[10px] text-slate-400">
                  Include bank details
                </p>
              </div>
            </div>

            <Switch
              checked={!!showBankDetails}
              onCheckedChange={(checked) =>
                setValue("showBankDetails", checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>

          {/* UPI Toggle */}
          <div className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Smartphone className="size-3.5 shrink-0 text-slate-400" />

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-700">
                  UPI details
                </p>

                <p className="truncate text-[10px] text-slate-400">
                  Include UPI details
                </p>
              </div>
            </div>

            <Switch
              checked={!!showUPIDetails}
              onCheckedChange={(checked) =>
                setValue("showUPIDetails", checked, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        {/* Bank + UPI Fields Always Visible */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Bank Details */}
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Landmark className="size-3" />
              Bank details
            </div>

            <Block
              label="Bank"
              value={bankName || "—"}
            />

            <Block
              label="Account number"
              value={accountNumber || "—"}
            />

            <Block
              label="IFSC"
              value={ifsc || "—"}
            />
          </div>

          {/* UPI Details */}
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Smartphone className="size-3" />
              UPI details
            </div>

            <Block
              label="UPI ID"
              value={upiId || "—"}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <MapPin className="size-3" />
          Address
        </div>

        <div className="space-y-0.5 text-slate-700">
          {a1 ? (
            <p>{a1}</p>
          ) : (
            <p className="text-slate-400">—</p>
          )}

          {a2 ? (
            <p className="text-slate-600">{a2}</p>
          ) : null}

          <p className="text-slate-600">
            {join(city, state, pincode) || "—"}
          </p>

          {country ? (
            <p className="text-slate-500">{country}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Block({
  label,
  value,
  strong,
  icon,
}: {
  label: string;
  value: string;
  strong?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>

      <p
        className={`break-words ${
          strong
            ? "font-medium text-slate-900"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}