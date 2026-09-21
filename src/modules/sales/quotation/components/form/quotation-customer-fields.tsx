"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import { STATE_CODE_MAP } from "@/modules/sales/shared/utils/state-code";
import CustomerSearchSelect, {
  type SelectedCustomer,
} from "@/modules/sales/shared/components/customer-search-select";

const STATES = Object.keys(STATE_CODE_MAP).map((state) => ({
  value: state,
  label: state
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  code: STATE_CODE_MAP[state],
}));

export function QuotationCustomerFields() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const reverseCharge = watch("reverseCharge");
  const placeOfSupply = watch("placeOfSupply");
  const placeOfSupplyCode = watch("placeOfSupplyCode");
  const taxType = watch("taxType");

  const applyCustomer = (customer: SelectedCustomer | null) => {
    if (!customer) {
      setValue("customerId", null, { shouldDirty: true });
      return;
    }

    setValue("customerId", customer.id, { shouldDirty: true });
    setValue("prospectName", customer.name || customer.companyName || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("prospectCompanyName", customer.companyName, { shouldDirty: true });
    setValue("prospectPhone", customer.mobile, { shouldDirty: true });
    setValue("prospectEmail", customer.email, { shouldDirty: true });
    setValue("prospectGSTIN", customer.gstin, { shouldDirty: true });
    setValue("prospectPAN", customer.pan, { shouldDirty: true });

    const bill = customer.billingAddress;
    if (!bill) return;

    setValue("prospectAddressLine1", bill.addressLine1, { shouldDirty: true });
    setValue("prospectAddressLine2", bill.addressLine2, { shouldDirty: true });
    setValue("prospectCity", bill.city, { shouldDirty: true });
    setValue("prospectPincode", bill.pincode, { shouldDirty: true });
    setValue("prospectCountry", bill.country || "India", { shouldDirty: true });

    if (bill.state) {
      const normalized = bill.state.trim().toLowerCase();
      const code = STATE_CODE_MAP[normalized] || "";
      setValue("prospectState", normalized, { shouldDirty: true });
      setValue("prospectStateCode", code || null, { shouldDirty: true });
      setValue("placeOfSupply", normalized, { shouldDirty: true });
      setValue("placeOfSupplyCode", code || null, { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-3">
      {/* CustomerSearchSelect already has its own label */}
      <CustomerSearchSelect onSelect={applyCustomer} />

      <Field label="Name" required error={errors.prospectName?.message}>
        <Input className="h-9" placeholder="Contact person" {...register("prospectName")} />
      </Field>

      <Field label="Company">
        <Input className="h-9" placeholder="Company name" {...register("prospectCompanyName")} />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Phone">
          <Input className="h-9" placeholder="+91 98765 43210" {...register("prospectPhone")} />
        </Field>
        <Field label="Email">
          <Input type="email" className="h-9" placeholder="email@company.com" {...register("prospectEmail")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="GSTIN">
          <Input className="h-9" placeholder="22AAAAA0000A1Z5" {...register("prospectGSTIN")} />
        </Field>
        <Field label="PAN">
          <Input className="h-9" placeholder="ABCDE1234F" {...register("prospectPAN")} />
        </Field>
      </div>

      <Field label="Address line 1">
        <Input className="h-9" placeholder="Building, street" {...register("prospectAddressLine1")} />
      </Field>

      <Field label="Address line 2">
        <Input className="h-9" placeholder="Area, landmark (optional)" {...register("prospectAddressLine2")} />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="City">
          <Input className="h-9" placeholder="City" {...register("prospectCity")} />
        </Field>
        <Field label="Pincode">
          <Input className="h-9" placeholder="110001" {...register("prospectPincode")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="State">
          <Select
            value={watch("prospectState") || ""}
            onValueChange={(value) => {
              const code = STATE_CODE_MAP[value] || "";
              setValue("prospectState", value, { shouldDirty: true });
              setValue("prospectStateCode", code || null, { shouldDirty: true });
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s.code} value={s.value}>
                  {s.label} ({s.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Country">
          <Input className="h-9" placeholder="India" {...register("prospectCountry")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Place of supply" required>
          <Select
            value={placeOfSupply || ""}
            onValueChange={(value) => {
              const code = STATE_CODE_MAP[value] || "";
              setValue("placeOfSupply", value, { shouldDirty: true });
              setValue("placeOfSupplyCode", code || null, { shouldDirty: true });
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s.code} value={s.value}>
                  {s.label} ({s.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1 text-[11px] text-slate-500">
            {placeOfSupply
              ? `${placeOfSupply}${placeOfSupplyCode ? ` (${placeOfSupplyCode})` : ""} · `
              : ""}
            {taxType === "INTER_STATE" ? "IGST" : "CGST + SGST"}
          </p>
        </Field>
        <Field label="Reverse charge">
          <Select
            value={reverseCharge ? "yes" : "no"}
            onValueChange={(v) =>
              setValue("reverseCharge", v === "yes", { shouldDirty: true })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-medium text-slate-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
