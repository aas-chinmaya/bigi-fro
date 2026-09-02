
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ClipboardEvent,
} from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePaymentReceiptQuery } from "../../hooks/use-payment-receipt-query";
import { usePaymentReceiptActions } from "../../hooks/use-payment-receipt-actions";
import { useCustomers } from "@/modules/customers/hooks/use-customers";

import {
  paymentReceiptFormSchema,
  toDateInputValue,
  sanitizeInput,
  type PaymentReceiptFormValues,
} from "../../validation/payment-receipt.validation";

import type { Customer } from "@/modules/customers/types";

interface PaymentReceiptEditFormProps {
  id: string;
}

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

export default function PaymentReceiptEditForm({
  id,
}: PaymentReceiptEditFormProps) {
  const router = useRouter();

  const {
    paymentReceipt,
    loading: queryLoading,
    error: queryError,
  } = usePaymentReceiptQuery(undefined, id);

  const { updatePaymentReceipt } = usePaymentReceiptActions();

  const {
    customers,
    loading: customersLoading,
  } = useCustomers();

  const [isOpen, setIsOpen] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<PaymentReceiptFormValues>({
    resolver: zodResolver(paymentReceiptFormSchema),
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

  /**
   * Populate form when receipt is loaded.
   */
  useEffect(() => {
    if (!paymentReceipt) return;

    reset(
      {
        receiptDate: toDateInputValue(
          paymentReceipt.receiptDate,
        ),

        customerId:
          paymentReceipt.customerId ?? "",

        customerName:
          paymentReceipt.customerName ?? "",

        receiptType:
          paymentReceipt.receiptType,

        amount:
          Number(paymentReceipt.amount ?? 0),

        paymentMethod:
          paymentReceipt.paymentMethod,

        referenceNo:
          paymentReceipt.referenceNo ?? "",

        remarks:
          paymentReceipt.remarks ?? "",
      },
      {
        keepErrors: false,
      },
    );
  }, [paymentReceipt, reset]);

  /**
   * Customer search.
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
  const selectedCustomer = (customers ?? []).find(
    (customer) =>
      String(customer.id) === String(customerId),
  );

  /**
   * Display customer name.
   */
  const customerLabel = selectedCustomer
    ? getCustomerLabel(selectedCustomer)
    : clean(paymentReceipt?.customerName);

  /**
   * Select customer.
   */
  const selectCustomer = (customer: Customer) => {
    const name = getCustomerLabel(customer);

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
      name,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setIsOpen(false);
    setCustomerQuery("");
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

    setCustomerQuery("");
  };

  /**
   * Sanitize pasted text.
   */
  const handleSanitizePaste = (
    event: ClipboardEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
    field: "referenceNo" | "remarks",
  ) => {
    event.preventDefault();

    const text =
      event.clipboardData.getData("text/plain") || "";

    const cleaned = sanitizeInput(text);

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
   * Submit.
   */
  const onSubmit = async (
    values: PaymentReceiptFormValues,
  ) => {
    const payload = {
      ...values,

      customerId:
        values.customerId?.trim() || undefined,

      customerName:
        values.customerName?.trim() || undefined,

      referenceNo:
        values.referenceNo?.trim() || undefined,

      remarks:
        values.remarks?.trim() || undefined,
    };

    try {
      const result =
        await updatePaymentReceipt(
          id,
          payload,
        );

      if (
        result.meta.requestStatus ===
        "fulfilled"
      ) {
        notify.success(
          "Payment receipt updated successfully",
        );

        router.push(
          `/sales/cash-receipt/${id}`,
        );

        return;
      }

      notify.error(
        (result.payload as string) ||
          "Failed to update payment receipt",
      );
    } catch {
      notify.error(
        "Unable to update payment receipt. Please try again.",
      );
    }
  };

  /**
   * Loading state.
   */
  if (queryLoading) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Loading payment receipt...
      </div>
    );
  }

  /**
   * Error state.
   */
  if (queryError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {queryError}
      </div>
    );
  }

  /**
   * Not found.
   */
  if (!paymentReceipt) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Payment receipt not found.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* =====================================================
          MONEY RECEIPT
      ====================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Edit Money Receipt
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* =================================================
              RECEIPT DATE
          ================================================== */}

          <div className="space-y-2">
            <Label htmlFor="receiptDate">
              Receipt Date{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <Input
              id="receiptDate"
              type="date"
              {...register("receiptDate")}
            />

            {errors.receiptDate && (
              <p className="text-xs text-red-500">
                {errors.receiptDate.message}
              </p>
            )}
          </div>

          {/* =================================================
              RECEIPT TYPE
          ================================================== */}

          <div className="space-y-2">
            <Label>
              Receipt Type{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <Select
              value={
                receiptType || undefined
              }
              onValueChange={(value) =>
                setValue(
                  "receiptType",
                  value as PaymentReceiptFormValues["receiptType"],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="INVOICE_PAYMENT">
                  Invoice Payment
                </SelectItem>

                <SelectItem value="CUSTOMER_ADVANCE">
                  Customer Advance
                </SelectItem>

                <SelectItem value="OTHER_RECEIPT">
                  Other Receipt
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.receiptType && (
              <p className="text-xs text-red-500">
                {errors.receiptType.message}
              </p>
            )}
          </div>

          {/* =================================================
              CUSTOMER
          ================================================== */}

          <div className="space-y-2">
            <Label>
              Customer{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <div className="flex min-w-0 items-center gap-2">
              <DropdownMenu
                open={isOpen}
                onOpenChange={setIsOpen}
              >
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
                  {/* SEARCH */}

                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      autoFocus
                      value={customerQuery}
                      onChange={(event) =>
                        setCustomerQuery(
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) =>
                        event.stopPropagation()
                      }
                      placeholder="Search customers..."
                      className="pl-9"
                    />
                  </div>

                  {/* CUSTOMER LIST */}

                  <div className="max-h-[200px] overflow-y-auto pr-1">
                    {customersLoading ? (
                      <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Loading customers...
                      </div>
                    ) : matchingCustomers.length ? (
                      matchingCustomers.map(
                        (customer) => (
                          <DropdownMenuItem
                            key={customer.id}
                            onSelect={(event) => {
                              event.preventDefault();
                              selectCustomer(
                                customer,
                              );
                            }}
                            className="flex-col items-start gap-0.5 px-3 py-2.5"
                          >
                            <span className="flex w-full items-center gap-2 font-medium text-gray-900">
                              {getCustomerLabel(
                                customer,
                              )}

                              {String(
                                customerId,
                              ) ===
                                String(
                                  customer.id,
                                ) && (
                                <Check className="ml-auto size-4 text-primary" />
                              )}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {[
                                (
                                  customer as any
                                ).companyName,

                                (
                                  customer as any
                                ).mobile,

                                (
                                  customer as any
                                ).email,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </DropdownMenuItem>
                        ),
                      )
                    ) : (
                      <div className="px-3 py-3 text-sm text-muted-foreground">
                        No customers found.
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {(selectedCustomer ||
                customerId) && (
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
              <p className="text-xs text-red-500">
                {errors.customerId.message}
              </p>
            )}
          </div>

          {/* =================================================
              AMOUNT
          ================================================== */}

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              {...register("amount", {
                valueAsNumber: true,
              })}
            />

            {errors.amount && (
              <p className="text-xs text-red-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* =================================================
              PAYMENT METHOD
          ================================================== */}

          <div className="space-y-2">
            <Label>
              Payment Method{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <Select
              value={
                paymentMethod || undefined
              }
              onValueChange={(value) => {
                setValue(
                  "paymentMethod",
                  value as PaymentReceiptFormValues["paymentMethod"],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                );

                setValue(
                  "referenceNo",
                  watch(
                    "referenceNo",
                  ) ?? "",
                  {
                    shouldValidate: true,
                  },
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="CASH">
                  Cash
                </SelectItem>

                <SelectItem value="BANK_TRANSFER">
                  Bank Transfer
                </SelectItem>

                <SelectItem value="UPI">
                  UPI
                </SelectItem>

                <SelectItem value="CHEQUE">
                  Cheque
                </SelectItem>

                <SelectItem value="CARD">
                  Card
                </SelectItem>

                <SelectItem value="OTHER">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.paymentMethod && (
              <p className="text-xs text-red-500">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* =================================================
              REFERENCE NUMBER
          ================================================== */}

          <div className="space-y-2">
            <Label htmlFor="referenceNo">
              Reference No
              {paymentMethod !==
                "CASH" && (
                <span className="text-red-500">
                  {" "}
                  *
                </span>
              )}
            </Label>

            <Input
              id="referenceNo"
              placeholder="Txn / cheque / UPI ref"
              {...register("referenceNo")}
              onPaste={(event) =>
                handleSanitizePaste(
                  event,
                  "referenceNo",
                )
              }
            />

            {errors.referenceNo && (
              <p className="text-xs text-red-500">
                {errors.referenceNo.message}
              </p>
            )}
          </div>

          {/* =================================================
              REMARKS
          ================================================== */}

          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Label htmlFor="remarks">
              Remarks
            </Label>

            <Textarea
              id="remarks"
              placeholder="Optional notes..."
              rows={2}
              className="resize-none"
              {...register("remarks")}
              onPaste={(event) =>
                handleSanitizePaste(
                  event,
                  "remarks",
                )
              }
            />

            {errors.remarks && (
              <p className="text-xs text-red-500">
                {errors.remarks.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Updating..."
            : "Update Payment Receipt"}
        </Button>
      </div>
    </form>
  );
}
