
"use client";

import {
  useMemo,
  useState,
  useEffect,
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
import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

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

const currentUser = {
  createdBy: "systemadmin",
  businessId: "cmf3a8gh9000008l3f2x8abcd",
  branchId: "BRANCH_ID_1003",
};

function Badge({ text }: { text: string }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center bg-slate-100 text-[9px] font-semibold text-slate-700">
      {String((text || "").slice(0, 2)).toUpperCase()}
    </span>
  );
}

const DEFAULT_VALUES: PaymentReceiptFormValues = {
  businessId: currentUser.businessId,
  branchId: currentUser.branchId,
  receiptDate: todayDateInputValue(),
  financialYear: getFinancialYearOptions()[10],
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerGSTIN: "",
  paymentMethod: "CASH",
  amount: 0,
  remarks: "",
  notes: "",
  createdBy: currentUser.createdBy,
  
};

export default function PaymentReceiptCreateForm() {
  const router = useRouter();

  const { createPaymentReceipt } = usePaymentReceiptActions();

  const { customers, loading: customersLoading } = useCustomers();

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

  const { invoices, getInvoices } = useInvoiceQuery();

  useEffect(() => {
    getInvoices();
  }, []);

  const customerId = watch("customerId");

  const [invoiceQuery, setInvoiceQuery] = useState("");
  const [invoiceFocused, setInvoiceFocused] = useState(false);
  const [customerSelectQuery, setCustomerSelectQuery] = useState("");

  const matchingCustomers = useMemo(() => {
    const query = (customerSelectQuery || "").trim().toLowerCase();

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
  }, [customerSelectQuery, customers]);


  const selectedCustomer = (
    customers ?? []
  ).find(
    (customer) =>
      String(customer.id) ===
      String(customerId),
  );




  const financialYearOptions = useMemo(() => getFinancialYearOptions(), []);

  const matchingInvoices = useMemo(() => {
    const q = (invoiceQuery || "").trim().toLowerCase();
    const list = invoices ?? [];
    if (!q) return list;
    return list.filter((inv: any) => String(inv.id).toLowerCase().includes(q) || String(inv.invoiceNumber || "").toLowerCase().includes(q));
  }, [invoiceQuery, invoices]);

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

    // show selected customer name in the input (same as invoice behaviour)
    setCustomerSelectQuery(customerName);
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
    setCustomerSelectQuery("");
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
      receiptDate: values.receiptDate,
      financialYear: values.financialYear?.trim() || computeFinancialYear(values.receiptDate),
      customerId: values.customerId?.trim() || "",
      customerName: values.customerName?.trim() || "",
      customerPhone: values.customerPhone?.trim() || (selectedCustomer as any)?.mobile || undefined,
      customerGSTIN: values.customerGSTIN?.trim() || (selectedCustomer as any)?.gstin || undefined,
      invoiceId: values.invoiceId?.trim() || undefined,
      paymentMethod: values.paymentMethod || "CASH",
      amount: Number(values.amount || 0),
      remarks: values.remarks?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
      createdBy: values.createdBy?.trim() || "system",
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
          "Payment receipt created successfully",
        );

        router.push(
          "/sales/payment-receipt",
        );

        return;
      }

      notify.error(
        (result.payload as string) ||
          "Failed to create payment receipt",
      );
    } catch {
      notify.error(
        "Unable to create payment receipt. Please try again.",
      );
    }
  };

  return (
    <form className="mx-auto f-full w-full  space-y-4">
      {/* hidden fields to ensure these are sent in payload */}
      <input {...register("businessId")} type="hidden" />
      <input {...register("branchId")} type="hidden" />
      <input {...register("invoiceId")} type="hidden" />
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="px-4 pb-3 pt-4 sm:px-5">
         <div className="flex items-start gap-3">
  <Receipt className="mt-1 size-6 shrink-0 text-primary" />

  <div>
    <CardTitle className="text-base font-semibold">
      Create Payment Receipt
    </CardTitle>

    <p className=" text-sm text-muted-foreground">
      Record a customer payment or advance receipt
    </p>
  </div>
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

                

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={customerSelectQuery}
                    onFocus={() => setCustomerSearchFocused(true)}
                    onBlur={() => setTimeout(() => setCustomerSearchFocused(false), 140)}
                    onChange={(event) => {
                      setCustomerSelectQuery(event.target.value);
                      setCustomerSearchFocused(true);
                    }}
                    placeholder="Search customer"
                    className="h-10 border-slate-200 bg-slate-50 pl-9 pr-9"
                  />
                  {customerSelectQuery && (
                    <button
                      type="button"
                      onClick={() => setCustomerSelectQuery("")}
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
                              <Badge text={name} />

                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-sm font-semibold text-slate-800">{name}</span>
                                  {isActive && <Check className="size-4 shrink-0 text-primary" />}
                                </span>
                                <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                                  <span className="truncate">{(customer as any).email || "No email"}</span>
                                </span>
                                <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
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
                <Input
                  id="receiptDate"
                  type="datetime-local"
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
                  <SelectContent className="max-h-[220px] overflow-y-auto rounded-xl">
                    {financialYearOptions.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <BadgeDollarSign className="size-4 text-slate-400" />
                  Payment Method
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("paymentMethod")}
                  onValueChange={(value) =>
                    setValue("paymentMethod", value as PaymentReceiptFormValues["paymentMethod"], {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[220px] overflow-y-auto rounded-xl">
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="NET_BANKING">Net Banking</SelectItem>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  <FileText className="size-4 text-slate-400" />
                  Invoice
                </Label>


                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={invoiceQuery}
                    onFocus={() => setInvoiceFocused(true)}
                    onBlur={() => setTimeout(() => setInvoiceFocused(false), 140)}
                    onChange={(e) => setInvoiceQuery(e.target.value)}
                    placeholder="Search invoice by id or number"
                    className="h-10 border-slate-200 bg-slate-50 pl-9 pr-9"
                  />

                  {invoiceQuery && (
                    <button
                      type="button"
                      onClick={() => setInvoiceQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-slate-500 hover:bg-slate-200"
                      aria-label="Clear invoice search"
                    >
                      <X className="size-4" />
                    </button>
                  )}

                  {invoiceFocused && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[220px] space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {(matchingInvoices.length ? matchingInvoices : invoices ?? []).map((inv: any) => (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => {
                            setValue("invoiceId", String(inv.id), { shouldDirty: true, shouldValidate: true });
                            setInvoiceQuery(String(inv.invoiceNumber || inv.id));
                            setInvoiceFocused(false);
                          }}
                          className={`flex w-full items-start gap-3 rounded-lg border p-2 text-left transition-colors ${String(watch("invoiceId")) === String(inv.id) ? "border-primary/30 bg-primary/5" : "border-slate-200 bg-white hover:bg-slate-100"}`}
                        >
                          <Badge text={String(inv.invoiceNumber || inv.id)} />
                          {/* <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-800">{inv.invoiceNumber || inv.id}</div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">{inv.customerName || inv.customerId}</div>
                          </div> */}


                          
                          <div className="min-w-0 flex-1">
  <div className="truncate text-sm font-semibold text-slate-800">
    {inv.invoiceNumber || inv.id}
  </div>

  <div className="mt-1 truncate text-[11px] text-slate-500">
    Customer: {inv.customerName || inv.customerId} 
  </div>
</div>
                        </button>
                      ))}
                    </div>
                  )}
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
