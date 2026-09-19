"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import { Building2, Calendar, FileText, Mail, MapPin, Phone } from "lucide-react";

function join(...parts: Array<string | null | undefined>) {
  return parts.map((p) => (p || "").trim()).filter(Boolean).join(", ");
}

export function QuotationIssuerFields() {
  const { control, register, formState: { errors } } =
    useFormContext<QuotationFormValues>();

  const name = useWatch({ control, name: "businessName" });
  const legal = useWatch({ control, name: "businessLegalName" });
  const gstin = useWatch({ control, name: "businessGSTIN" });
  const phone = useWatch({ control, name: "businessPhone" });
  const email = useWatch({ control, name: "businessEmail" });
  const a1 = useWatch({ control, name: "businessAddressLine1" });
  const a2 = useWatch({ control, name: "businessAddressLine2" });
  const city = useWatch({ control, name: "businessCity" });
  const state = useWatch({ control, name: "businessState" });
  const pincode = useWatch({ control, name: "businessPincode" });
  const country = useWatch({ control, name: "businessCountry" });

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <Calendar className="size-3.5 text-slate-400" />
          Due date
          <span className="text-red-500">*</span>
        </Label>
        <Input type="date" className="h-9" {...register("validUntil")} />
        {errors.validUntil && (
          <p className="text-[11px] text-red-500">{errors.validUntil.message}</p>
        )}
      </div>

      <Block
        icon={<Building2 className="size-3.5" />}
        label="Business"
        value={name || "—"}
        strong
      />
      {legal ? <Block label="Legal name" value={legal} /> : null}
      <Block
        icon={<FileText className="size-3.5" />}
        label="GSTIN"
        value={gstin || "—"}
      />
      <Block
        icon={<Phone className="size-3.5" />}
        label="Phone"
        value={phone || "—"}
      />
      <Block
        icon={<Mail className="size-3.5" />}
        label="Email"
        value={email || "—"}
      />

      <div className="space-y-1.5 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <MapPin className="size-3" />
          Address
        </div>
        <div className="space-y-0.5 text-slate-700">
          {a1 ? <p>{a1}</p> : <p className="text-slate-400">—</p>}
          {a2 ? <p className="text-slate-600">{a2}</p> : null}
          <p className="text-slate-600">{join(city, state, pincode) || "—"}</p>
          {country ? <p className="text-slate-500">{country}</p> : null}
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
          strong ? "font-medium text-slate-900" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
