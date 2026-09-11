// ============================================================
// components/sales/quotation/form/quotation-parties-section.tsx
// ============================================================

"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuotationFormValues } from "./quotation.schema";

// You can later replace this with your real CustomerSelect component
// import { CustomerSelect } from "@/components/sales/shared/customer-select";

export function QuotationPartiesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">From & To</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ==================== FROM ==================== */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              From (Your Company)
            </h3>

            <div className="space-y-2">
              <Label>
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input {...register("fromName")} placeholder="Your company name" />
              {errors.fromName && (
                <p className="text-xs text-destructive">
                  {errors.fromName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register("fromEmail")} placeholder="email@company.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register("fromPhone")} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input {...register("fromGstin")} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div className="space-y-2">
                <Label>PAN</Label>
                <Input {...register("fromPan")} placeholder="AAAAA0000A" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input {...register("fromAddressLine1")} placeholder="Street address" />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input {...register("fromAddressLine2")} placeholder="Landmark, area" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...register("fromCity")} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...register("fromState")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input {...register("fromCountry")} />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input {...register("fromPincode")} />
              </div>
            </div>
          </div>

          {/* ==================== TO ==================== */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              To (Customer)
            </h3>

            {/* Later replace with <CustomerSelect /> */}
            <div className="space-y-2">
              <Label>
                Customer Name <span className="text-destructive">*</span>
              </Label>
              <Input {...register("toName")} placeholder="Customer / Company name" />
              {errors.toName && (
                <p className="text-xs text-destructive">
                  {errors.toName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input {...register("toContactPerson")} placeholder="Contact person name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register("toEmail")} placeholder="customer@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register("toPhone")} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input {...register("toGstin")} />
              </div>
              <div className="space-y-2">
                <Label>PAN</Label>
                <Input {...register("toPan")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input {...register("toAddressLine1")} />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input {...register("toAddressLine2")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...register("toCity")} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...register("toState")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input {...register("toCountry")} />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input {...register("toPincode")} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}