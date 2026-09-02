
"use client";

import {
  useMemo,
  useState,
  type ClipboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeDollarSign,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  IndianRupee,
  Loader2,
  Mail,
  MessageSquareText,
  NotebookText,
  Phone,
  Receipt,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";

import { notify } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePaymentReceiptActions } from "../../hooks/use-payment-receipt-actions";
import { useCustomers } from "@/modules/customers/hooks/use-customers";

import {
  paymentReceiptFormSchema,
  todayDateInputValue,
  sanitizeInput,
  type PaymentReceiptFormValues,
} from "../../validation/payment-receipt.validation";

import type { CreatePaymentReceiptPayload } from "../../types/payment-receipt.types";
import type { Customer } from "@/modules/customers/types";

function clean(value?: string | null): string {
  return value?.trim() || "";
}

function getCustomerLabel(customer: Customer): string {
  return (
    clean((customer as any).name) ||
    clean((customer as any).customerName) ||
    clean((customer as any).companyName) ||
    String(customer.id)
  );
}

function getFinancialYearOptions(): string[] {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 21 }, (_, index) => {
    const year = currentYear - 10 + index;
    return `${year}-${String(year + 1).slice(-2)}`;
  });
}

const DEFAULT_VALUES: PaymentReceiptFormValues = {
  businessId: "",
  branchId: "",
  receiptNumber: "",
  receiptDate: todayDateInputValue(),
  financialYear: getFinancialYearOptions()[10],
  receiptStatus: "RECEIVED",
  receiptSource: "POS",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerGSTIN: "",
  paymentId: "",
  paymentMethod: "CASH",
  documentNumber: "",
  amount: 0,
  remarks: "",
  notes: "",
  createdBy: "system",
  updatedBy: "",
};

export default function PaymentReceiptCreateForm() {
  const router = useRouter();

  const { createPaymentReceipt } = usePaymentReceiptActions();

  const { customers, loading: customersLoading } = useCustomers();

  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSearchFocused, setCustomerSearchFocused] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
      isValid,
    },
  } = useForm<PaymentReceiptFormValues>({
    resolver: zodResolver(paymentReceiptFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const customerId = watch("customerId");

  /**
   * Search customers.
   */
  const matchingCustomers = useMemo(() => {
    const query = customerQuery
      .trim()
      .toLowerCase();

    const list = customers ?? [];

    if (!query) {
      return list;
    }

    return list.filter((customer) =>
      [
        (customer as any).name,
        (customer as any).customerName,
        (customer as any).companyName,
        (customer as any).mobile,
        (customer as any).email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query),
        ),
    );
  }, [customerQuery, customers]);

  /**
   * Selected customer.
   */
  const selectedCustomer = (
    customers ?? []
  ).find(
    (customer) =>
      String(customer.id) ===
      String(customerId),
  );

  /**
   * Customer display name.
   */
  const customerLabel = selectedCustomer
    ? getCustomerLabel(selectedCustomer)
    : "";

  const customerMeta = selectedCustomer
    ? [
        (selectedCustomer as any).companyName,
        (selectedCustomer as any).mobile,
        (selectedCustomer as any).email,
      ]
        .filter(Boolean)
        .join(" • ")
    : "";

  const financialYearOptions = useMemo(() => getFinancialYearOptions(), []);

  /**
   * Select customer.
   */
  const selectCustomer = (
    customer: Customer,
  ) => {
    const customerName =
      getCustomerLabel(customer);

    setValue(
      "customerId",
      String(customer.id),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setValue(
      "customerName",
      customerName,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setValue(
      "customerPhone",
      (customer as any).mobile ?? "",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setValue(
      "customerGSTIN",
      (customer as any).gstin ?? "",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setCustomerQuery("");
    setCustomerSearchFocused(false);
  };

  /**
   * Clear customer.
   */
  const clearCustomer = () => {
    setValue(
      "customerId",
      "",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setValue(
      "customerName",
      "",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setValue("customerPhone", "", {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("customerGSTIN", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCustomerQuery("");
  };

  /**
   * Sanitize pasted text.
   */
  const handleSanitizePaste = (
    event: ClipboardEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
    field: "remarks" | "notes",
  ) => {
    event.preventDefault();

    const text =
      event.clipboardData.getData(
        "text/plain",
      ) || "";

    const cleaned =
      sanitizeInput(text);

    setValue(
      field,
      cleaned,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  /**
   * Submit money receipt.
   */
  const onSubmit = async (values: PaymentReceiptFormValues) => {
    const computeFinancialYear = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;

        if (month >= 4) {
          return `${year}-${String(year + 1).slice(-2)}`;
        }

        return `${year - 1}-${String(year).slice(-2)}`;
      } catch {
        return String(new Date().getFullYear());
      }
    };

    const payload: CreatePaymentReceiptPayload = {
      businessId: values.businessId?.trim() || undefined,
      branchId: values.branchId?.trim() || undefined,
      receiptNumber: values.receiptNumber?.trim() || undefined,
      receiptDate: values.receiptDate,
      financialYear: values.financialYear?.trim() || computeFinancialYear(values.receiptDate),
      receiptStatus: "RECEIVED",
      receiptSource: values.receiptSource || "POS",
      customerId: values.customerId?.trim() || "",
      customerName: values.customerName?.trim() || "",
      customerPhone: values.customerPhone?.trim() || (selectedCustomer as any)?.mobile || undefined,
      customerGSTIN: values.customerGSTIN?.trim() || (selectedCustomer as any)?.gstin || undefined,
      paymentId: values.paymentId?.trim() || undefined,
      paymentMethod: values.paymentMethod || "CASH",
      documentNumber: values.documentNumber?.trim() || "",
      amount: Number(values.amount || 0),
      remarks: values.remarks?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
      createdBy: values.createdBy?.trim() || "system",
      updatedBy: values.updatedBy?.trim() || undefined,
    };

    try {
      const result =
        await createPaymentReceipt(
          payload,
        );

      if (
        result.meta.requestStatus ===
        "fulfilled"
      ) {
        notify.success(
          "Money receipt created successfully",
        );

        router.push(
          "/sales/payment-receipt",
        );

        return;
      }

      notify.error(
        (result.payload as string) ||
          "Failed to create money receipt",
      );
    } catch {
      notify.error(
        "Unable to create money receipt. Please try again.",
      );
    }
  };

  return (
    <form className="mx-auto w-full max-w-6xl space-y-4">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
          <div className="flex items-center gap-2">
            <Receipt className="size-5 text-primary" />
            <CardTitle className="text-base font-semibold">Create Money Receipt</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-4 pb-4 sm:px-5">
          <div className="grid gap-4 xl:grid-cols-[1.15fr_1.85fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <UserRound className="size-4 text-slate-400" />
                  Customer
                  <span className="text-red-500">*</span>
                </Label>

                {selectedCustomer && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary">
                          {customerLabel.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-800">{customerLabel}</div>
                          <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Selected</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={clearCustomer}
                        className="rounded-full p-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Clear selected customer"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="size-3.5 text-slate-400" />
                        <span className="truncate">{(selectedCustomer as any).email || "No email"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-3.5 text-slate-400" />
                        <span className="truncate">{(selectedCustomer as any).mobile || "No phone"}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={customerQuery}
                    onFocus={() => setCustomerSearchFocused(true)}
                    onBlur={() => setTimeout(() => setCustomerSearchFocused(false), 140)}
                    onChange={(event) => {
                      setCustomerQuery(event.target.value);
                      setCustomerSearchFocused(true);
                    }}
                    placeholder="Search customer"
                    className="h-10 border-slate-200 bg-slate-50 pl-9 pr-9"
                  />
                  {customerQuery && (
                    <button
                      type="button"
                      onClick={() => setCustomerQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-slate-500 hover:bg-slate-200"
                      aria-label="Clear customer search"
                    >
                      <X className="size-4" />
                    </button>
                  )}

                  {customerSearchFocused && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[220px] space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {customersLoading ? (
                        <div className="flex items-center gap-2 px-2 py-2 text-sm text-slate-500">
                          <Loader2 className="size-4 animate-spin" />
                          Loading customers...
                        </div>
                      ) : matchingCustomers.length ? (
                        matchingCustomers.map((customer) => {
                          const isActive = String(customerId) === String(customer.id);
                          const name = getCustomerLabel(customer);

                          return (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => selectCustomer(customer)}
                              className={`flex w-full items-start gap-3 rounded-lg border p-2 text-left transition-colors ${
                                isActive
                                  ? "border-primary/30 bg-primary/5"
                                  : "border-slate-200 bg-white hover:bg-slate-100"
                              }`}
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-700">
                                {name.slice(0, 2).toUpperCase()}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-sm font-semibold text-slate-800">{name}</span>
                                  {isActive && <Check className="size-4 shrink-0 text-primary" />}
                                </span>
                                <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                                  <Mail className="size-3.5" />
                                  <span className="truncate">{(customer as any).email || "No email"}</span>
                                </span>
                                <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                                  <Phone className="size-3.5" />
                                  <span className="truncate">{(customer as any).mobile || "No phone"}</span>
                                </span>
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-2 py-3 text-sm text-slate-500">No customer found.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptDate" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <CalendarDays className="size-4 text-slate-400" />
                  Date
                  <span className="text-red-500">*</span>
                </Label>
                <DateInput
                  id="receiptDate"
                  {...register("receiptDate")}
                  aria-invalid={Boolean(errors.receiptDate)}
                  className="h-10 border-slate-200 bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <ShieldCheck className="size-4 text-slate-400" />
                  Financial Year
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("financialYear") || undefined}
                  onValueChange={(value) =>
                    setValue("financialYear", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialYearOptions.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    <FileText className="size-4 text-slate-400" />
                    Source
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("receiptSource")}
                    onValueChange={(value) =>
                      setValue("receiptSource", value as PaymentReceiptFormValues["receiptSource"], {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POS">POS</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    <IndianRupee className="size-4 text-slate-400" />
                    Amount
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      {...register("amount", { valueAsNumber: true })}
                      aria-invalid={Boolean(errors.amount)}
                      className="h-10 border-slate-200 bg-slate-50 pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <MessageSquareText className="size-4 text-slate-400" />
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Optional remarks..."
                  rows={3}
                  className="min-h-[90px] resize-y border-slate-200 bg-slate-50"
                  {...register("remarks")}
                  onPaste={(event) => handleSanitizePaste(event, "remarks")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <NotebookText className="size-4 text-slate-400" />
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Optional internal notes..."
                  rows={3}
                  className="min-h-[90px] resize-y border-slate-200 bg-slate-50"
                  {...register("notes")}
                  onPaste={(event) => handleSanitizePaste(event, "notes")}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="secondary" onClick={() => reset(DEFAULT_VALUES)} disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
