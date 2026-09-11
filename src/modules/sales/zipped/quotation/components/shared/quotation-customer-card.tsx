"use client";

import { Controller, useFormContext } from "react-hook-form";
import { UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormField from "@/components/form/FormField";
import { QuotationSearchableSelect } from "./quotation-searchable-select";
import { useCustomerOptions } from "../../hooks/use-customer-options";
import type { QuotationFormValues } from "../../schema/quotation.schema";

export function QuotationCustomerCard() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const { options, loading, setSearch, getCustomerById } = useCustomerOptions();

  const handleSelectCustomer = (id: string) => {
    const customer = getCustomerById(id);

    setValue("customerId", id, { shouldValidate: true, shouldDirty: true });
    setValue("customerName", customer?.label || "", { shouldValidate: true });
    setValue("customerPhone", customer?.phone || "");
    setValue("customerEmail", customer?.email || "");
    setValue("customerGSTIN", customer?.gstin || "");
  };

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-2">
        <UserRound className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Customer</h3>
      </div>

      <FormField label="Customer" required error={errors.customerId?.message}>
        <Controller
          control={control}
          name="customerId"
          render={({ field }) => (
            <QuotationSearchableSelect
              value={field.value}
              onChange={handleSelectCustomer}
              options={options}
              loading={loading}
              placeholder="Select a customer"
              onSearch={setSearch}
            />
          )}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Phone" error={errors.customerPhone?.message}>
          <Controller
            control={control}
            name="customerPhone"
            render={({ field }) => <Input {...field} placeholder="Phone number" />}
          />
        </FormField>

        <FormField label="Email" error={errors.customerEmail?.message}>
          <Controller
            control={control}
            name="customerEmail"
            render={({ field }) => <Input {...field} type="email" placeholder="Email address" />}
          />
        </FormField>

        <FormField label="GSTIN" error={errors.customerGSTIN?.message}>
          <Controller
            control={control}
            name="customerGSTIN"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="22AAAAA0000A1Z5"
                className="uppercase"
                maxLength={15}
              />
            )}
          />
        </FormField>
      </div>
    </Card>
  );
}
