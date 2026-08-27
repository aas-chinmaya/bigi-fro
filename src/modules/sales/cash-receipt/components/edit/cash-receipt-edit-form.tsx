"use client";

import { useEffect, useMemo, useState, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { notify } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCashReceiptQuery } from "../../hooks/use-cash-receipt-query";
import { useCashReceiptActions } from "../../hooks/use-cash-receipt-actions";
import { useCustomers } from "@/modules/customers/hooks/use-customers";

import {
  cashReceiptFormSchema,
  toDateInputValue,
  sanitizeInput,
  type CashReceiptFormValues,
} from "../../validation/cash-receipt.validation";
import type { Customer } from "@/modules/customers/types";

interface CashReceiptEditFormProps {
  id: string;
}

function clean(value?: string | null) {
  return value && value.trim() ? value.trim() : "";
}

function getCustomerLabel(c: Customer) {
  return (
    clean((c as any).name) ||
    clean((c as any).customerName) ||
    clean((c as any).companyName) ||
    String(c.id)
  );
}

export default function CashReceiptEditForm({ id }: CashReceiptEditFormProps) {
  const router = useRouter();

  const {
    cashReceipt,
    loading: queryLoading,
    error: queryError,
  } = useCashReceiptQuery(undefined, id);

  const { updateCashReceipt } = useCashReceiptActions();
  const { customers, loading: customersLoading } = useCustomers();

  const [isOpen, setIsOpen] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CashReceiptFormValues>({
    resolver: zodResolver(cashReceiptFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      receiptDate: "",
      customerId: "",
      customerName: "",
      receiptType: "INVOICE_PAYMENT",
      amount: 0,
      paymentMethod: "CASH",
      referenceNo: "",
      remarks: "",
    },
  });

  const receiptType = watch("receiptType");
  const paymentMethod = watch("paymentMethod");
  const customerId = watch("customerId");

  useEffect(() => {
    if (!cashReceipt) return;

    reset(
      {
        receiptDate: toDateInputValue(cashReceipt.receiptDate),
        customerId: cashReceipt.customerId ?? "",
        customerName: cashReceipt.customerName ?? "",
        receiptType: cashReceipt.receiptType,
        amount: Number(cashReceipt.amount ?? 0),
        paymentMethod: cashReceipt.paymentMethod,
        referenceNo: cashReceipt.referenceNo ?? "",
        remarks: cashReceipt.remarks ?? "",
      },
      { keepErrors: false },
    );
  }, [cashReceipt, reset]);

  const matchingCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    const list = customers ?? [];
    if (!query) return list;

    return list.filter((customer) =>
      [
        (customer as any).name,
        (customer as any).customerName,
        (customer as any).companyName,
        (customer as any).mobile,
        (customer as any).email,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [customerQuery, customers]);

  const selectedCustomer = (customers ?? []).find(
    (c) => String(c.id) === String(customerId),
  );

  const customerLabel = selectedCustomer
    ? getCustomerLabel(selectedCustomer)
    : clean(cashReceipt?.customerName) || "";

  const selectCustomer = (customer: Customer) => {
    setValue("customerId", String(customer.id), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("customerName", getCustomerLabel(customer), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setIsOpen(false);
    setCustomerQuery("");
  };

  const clearCustomer = () => {
    setValue("customerId", "", { shouldDirty: true, shouldValidate: true });
    setValue("customerName", "", { shouldDirty: true, shouldValidate: true });
    setCustomerQuery("");
  };

  const handleSanitizePaste = (
    e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "referenceNo" | "remarks",
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain") || "";
    const cleaned = sanitizeInput(text);
    setValue(field, cleaned, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: CashReceiptFormValues) => {
    const payload = {
      ...values,
      customerId: values.customerId?.trim() || undefined,
      customerName: values.customerName?.trim() || undefined,
      referenceNo: values.referenceNo?.trim() || undefined,
      remarks: values.remarks?.trim() || undefined,
    };

    try {
      const result = await updateCashReceipt(id, payload);

      if (result.meta.requestStatus === "fulfilled") {
        notify.success("Cash receipt updated successfully");
        router.push(`/sales/cash-receipt/${id}`);
      } else {
        notify.error(
          (result.payload as string) || "Failed to update cash receipt",
        );
      }
    } catch {
      notify.error("Unable to update cash receipt. Please try again.");
    }
  };

  if (queryLoading) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Loading cash receipt...
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {queryError}
      </div>
    );
  }
  if (!cashReceipt) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Cash receipt not found.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Cash Receipt</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="receiptDate">
              Receipt Date <span className="text-red-500">*</span>
            </Label>
            <Input id="receiptDate" type="date" {...register("receiptDate")} />
            {errors.receiptDate && (
              <p className="text-xs text-red-500">{errors.receiptDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Receipt Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={receiptType || undefined}
              onValueChange={(v) =>
                setValue(
                  "receiptType",
                  v as CashReceiptFormValues["receiptType"],
                  { shouldValidate: true, shouldDirty: true },
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INVOICE_PAYMENT">Invoice Payment</SelectItem>
                <SelectItem value="CUSTOMER_ADVANCE">Customer Advance</SelectItem>
                <SelectItem value="OTHER_RECEIPT">Other Receipt</SelectItem>
              </SelectContent>
            </Select>
            {errors.receiptType && (
              <p className="text-xs text-red-500">{errors.receiptType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Customer <span className="text-red-500">*</span>
            </Label>
            <div className="flex min-w-0 items-center gap-2">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="h-10 min-w-0 flex-1 justify-between font-normal"
                  >
                    <span className="min-w-0 flex-1 truncate text-left">
                      {customerLabel ||
                        (customersLoading
                          ? "Loading customers..."
                          : "Search or select customer")}
                    </span>
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-[var(--radix-dropdown-menu-trigger-width)] p-2"
                >
                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      autoFocus
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder="Search customers..."
                      className="pl-9"
                    />
                  </div>

                  <div className="max-h-[200px] overflow-y-auto pr-1">
                    {customersLoading ? (
                      <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Loading customers...
                      </div>
                    ) : matchingCustomers.length ? (
                      matchingCustomers.map((customer) => (
                        <DropdownMenuItem
                          key={customer.id}
                          onSelect={(e) => {
                            e.preventDefault();
                            selectCustomer(customer);
                          }}
                          className="flex-col items-start gap-0.5 px-3 py-2.5"
                        >
                          <span className="flex w-full items-center gap-2 font-medium text-gray-900">
                            {getCustomerLabel(customer)}
                            {String(customerId) === String(customer.id) && (
                              <Check className="ml-auto size-4 text-primary" />
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {[
                              (customer as any).companyName,
                              (customer as any).mobile,
                              (customer as any).email,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-muted-foreground">
                        No customers found.
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {(selectedCustomer || customerId) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearCustomer}
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  aria-label="Clear customer"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
            {errors.customerId && (
              <p className="text-xs text-red-500">{errors.customerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <Select
              value={paymentMethod || undefined}
              onValueChange={(v) => {
                setValue(
                  "paymentMethod",
                  v as CashReceiptFormValues["paymentMethod"],
                  { shouldValidate: true, shouldDirty: true },
                );
                setValue("referenceNo", watch("referenceNo") ?? "", {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-xs text-red-500">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNo">
              Reference No
              {paymentMethod !== "CASH" && (
                <span className="text-red-500"> *</span>
              )}
            </Label>
            <Input
              id="referenceNo"
              placeholder="Txn / cheque / UPI ref"
              {...register("referenceNo")}
              onPaste={(e) => handleSanitizePaste(e, "referenceNo")}
            />
            {errors.referenceNo && (
              <p className="text-xs text-red-500">
                {errors.referenceNo.message}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Optional notes..."
              rows={2}
              className="resize-none"
              {...register("remarks")}
              onPaste={(e) => handleSanitizePaste(e, "remarks")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Cash Receipt"}
        </Button>
      </div>
    </form>
  );
}