import { z } from "zod";

export const cashReceiptSchema = z.object({
  receiptDate: z
    .string()
    .min(1, "Receipt date is required"),

  customerId: z
    .string()
    .min(1, "Customer is required"),

  receiptType: z.enum([
    "INVOICE_PAYMENT",
    "CUSTOMER_ADVANCE",
    "OTHER_RECEIPT",
  ]),

  amount: z
    .number({
      message: "Amount is required",
    })
    .positive("Amount must be greater than 0"),

  paymentMethod: z.enum([
    "CASH",
    "BANK_TRANSFER",
    "UPI",
    "CHEQUE",
    "CARD",
    "OTHER",
  ]),

  accountId: z
    .string()
    .min(1, "Account is required"),

  referenceNo: z
    .string()
    .trim()
    .max(
      100,
      "Reference number cannot exceed 100 characters",
    )
    .optional()
    .or(z.literal("")),

  remarks: z
    .string()
    .trim()
    .max(
      500,
      "Remarks cannot exceed 500 characters",
    )
    .optional()
    .or(z.literal("")),
});

export type CashReceiptFormValues =
  z.infer<typeof cashReceiptSchema>;