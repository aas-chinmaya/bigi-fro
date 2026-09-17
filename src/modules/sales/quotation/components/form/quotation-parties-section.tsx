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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import { STATE_CODE_MAP } from "@/modules/sales/shared/utils/state-code";

const STATES = Object.keys(STATE_CODE_MAP).map((state) => ({
  value: state,
  label: state
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  code: STATE_CODE_MAP[state],
}));

export function QuotationPartiesSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const prospectState = watch("prospectState");
  const placeOfSupplyCode =
    STATE_CODE_MAP[prospectState?.trim().toLowerCase() || ""] || "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold tracking-tight">
          Parties
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ── Quotation From ── */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Quotation From</h3>
              <p className="text-xs text-muted-foreground">Your Details</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Enter business name"
                  className="h-9"
                  {...register("businessName")}
                />
                {errors.businessName && (
                  <p className="text-xs text-destructive">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Legal Name</Label>
                <Input
                  placeholder="Legal / registered name"
                  className="h-9"
                  {...register("businessLegalName")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">GSTIN</Label>
                <Input
                  placeholder="22AAAAA0000A1Z5"
                  className="h-9"
                  {...register("businessGSTIN")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input
                  placeholder="+91 98765 43210"
                  className="h-9"
                  {...register("businessPhone")}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  placeholder="hello@company.com"
                  className="h-9"
                  {...register("businessEmail")}
                />
              </div>
            </div>
          </section>

          {/* ── Quotation For ── */}
          <section className="space-y-4 lg:border-l lg:pl-8">
            <div>
              <h3 className="text-sm font-semibold">Quotation For</h3>
              <p className="text-xs text-muted-foreground">
                Client&apos;s Details
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">
                  Prospect Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Contact person name"
                  className="h-9"
                  {...register("prospectName")}
                />
                {errors.prospectName && (
                  <p className="text-xs text-destructive">
                    {errors.prospectName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Company Name</Label>
                <Input
                  placeholder="Client company"
                  className="h-9"
                  {...register("prospectCompanyName")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input
                  placeholder="+91 98765 43210"
                  className="h-9"
                  {...register("prospectPhone")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  placeholder="client@company.com"
                  className="h-9"
                  {...register("prospectEmail")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">GSTIN</Label>
                <Input
                  placeholder="22AAAAA0000A1Z5"
                  className="h-9"
                  {...register("prospectGSTIN")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">PAN</Label>
                <Input
                  placeholder="ABCDE1234F"
                  className="h-9"
                  {...register("prospectPAN")}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Address Line 1</Label>
                <Input
                  placeholder="Street address, building, etc."
                  className="h-9"
                  {...register("prospectAddressLine1")}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Address Line 2</Label>
                <Input
                  placeholder="Area, landmark (optional)"
                  className="h-9"
                  {...register("prospectAddressLine2")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">City</Label>
                <Input
                  placeholder="City"
                  className="h-9"
                  {...register("prospectCity")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">State</Label>
                <Select
                  value={prospectState || ""}
                  onValueChange={(value) => {
                    const code = STATE_CODE_MAP[value] || "";
                    setValue("prospectState", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("prospectStateCode", code || null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("placeOfSupply", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("placeOfSupplyCode", code || null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state.code} value={state.value}>
                        {state.label} ({state.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Pincode</Label>
                <Input
                  placeholder="110001"
                  className="h-9"
                  {...register("prospectPincode")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Country</Label>
                <Input
                  placeholder="India"
                  className="h-9"
                  {...register("prospectCountry")}
                />
              </div>

              {/* Place of Supply */}
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Place of Supply</Label>
                <div className="flex gap-2">
                  <Input
                    value={prospectState || ""}
                    readOnly
                    placeholder="Select state above"
                    className="h-9 bg-muted/40"
                    {...register("placeOfSupply")}
                  />
                  <div className="flex h-9 min-w-[72px] shrink-0 items-center justify-center gap-1 rounded-md border bg-muted/30 px-2.5">
                    <span className="text-[10px] text-muted-foreground">
                      Code
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {placeOfSupplyCode || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}