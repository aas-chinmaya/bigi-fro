"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCashReceiptActions } from "../../hooks/use-cash-receipt-actions";

import type {
  CashReceiptPaymentMethod,
  CashReceiptType,
  CreateCashReceiptPayload,
} from "../../types/cash-receipt.types";

const DEFAULT_VALUES: CreateCashReceiptPayload = {
  receiptDate: new Date()
    .toISOString()
    .split("T")[0],

  customerId: "",

  receiptType: "INVOICE_PAYMENT",

  amount: 0,

  paymentMethod: "CASH",

  accountId: "",

  referenceNo: "",

  remarks: "",
};

export default function CashReceiptForm() {
  const router = useRouter();

  const {
    createCashReceipt,
  } = useCashReceiptActions();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateCashReceiptPayload>({
    defaultValues: DEFAULT_VALUES,
  });

  const receiptType = watch(
    "receiptType",
  );

  const paymentMethod = watch(
    "paymentMethod",
  );

  const onSubmit = async (
    values: CreateCashReceiptPayload,
  ) => {
    const result =
      await createCashReceipt(values);

    if (
      createCashReceipt &&
      result.meta.requestStatus === "fulfilled"
    ) {
      router.push("/sales/cash-receipt");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Receipt Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Receipt Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Receipt Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Receipt Date
            </label>

            <Input
              type="date"
              {...register("receiptDate", {
                required:
                  "Receipt date is required",
              })}
            />

            {errors.receiptDate && (
              <p className="text-xs text-destructive">
                {errors.receiptDate.message}
              </p>
            )}
          </div>

          {/* Receipt Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Receipt Type
            </label>

            <Select
              value={receiptType}
              onValueChange={(value) =>
                setValue(
                  "receiptType",
                  value as CashReceiptType,
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
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
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Customer
            </label>

            <Input
              placeholder="Customer ID"
              {...register("customerId")}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amount
            </label>

            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message:
                    "Amount must be greater than 0",
                },
              })}
            />

            {errors.amount && (
              <p className="text-xs text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Payment Method
            </label>

            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setValue(
                  "paymentMethod",
                  value as CashReceiptPaymentMethod,
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
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
          </div>

          {/* Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Account
            </label>

            <Input
              placeholder="Account ID"
              {...register("accountId", {
                required:
                  "Account is required",
              })}
            />

            {errors.accountId && (
              <p className="text-xs text-destructive">
                {errors.accountId.message}
              </p>
            )}
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reference No
            </label>

            <Input
              placeholder="Transaction / cheque / UPI reference"
              {...register("referenceNo")}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">
              Remarks
            </label>

            <Input
              placeholder="Additional remarks"
              {...register("remarks")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
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
            ? "Saving..."
            : "Create Cash Receipt"}
        </Button>
      </div>
    </form>
  );
}