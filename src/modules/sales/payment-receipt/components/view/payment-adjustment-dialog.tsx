


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { z } from "zod";
// import { Check, FileText, Loader2, Search, X } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { notify } from "@/lib/toast";
// import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";
// import { usePaymentAdjustment } from "@/modules/sales/payment-receipt/hooks/use-payment-adjustment";
// import type { PaymentReceipt } from "../../types/payment-receipt.types";

// const paymentAdjustmentSchema = z.object({
//   businessId: z.string().min(1),
//   branchId: z.string().optional(),
//   customerId: z.string().min(1),
//   paymentId: z.string().min(1),
//   documentType: z.enum(["SALES_INVOICE"]),
//   documentId: z.string().min(1, "Please select an invoice"),
//   documentNumber: z.string().min(1, "Please select an invoice"),
//   amount: z.coerce.number().positive(),
//   adjustmentType: z.enum(["ADVANCE", "INSTALLMENT"]),
//   adjustmentDate: z.string().optional(),
//   remarks: z.string().optional(),
//   createdBy: z.string().min(1),
// });

// interface PaymentAdjustmentDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   paymentReceipt: PaymentReceipt;
// }

// export default function PaymentAdjustmentDialog({
//   open,
//   onOpenChange,
//   paymentReceipt,
// }: PaymentAdjustmentDialogProps) {
//   const [loading, setLoading] = useState(false);
//   const [invoiceQuery, setInvoiceQuery] = useState("");
//   const [invoiceFocused, setInvoiceFocused] = useState(false);

//   const { invoices, getInvoices, loading: invoicesLoading } = useInvoiceQuery();
// const {
//   createAdjustment,
//   loading: adjustmentLoading,
// } = usePaymentAdjustment();


//   useEffect(() => {
//     if (open) {
//       getInvoices?.();
//     }
//   }, [open]);

//   const [form, setForm] = useState({
//     businessId: paymentReceipt.businessId || "",
//     branchId: paymentReceipt.branchId || "",
//     customerId: paymentReceipt.customerId || "",
//     paymentId: paymentReceipt.paymentId || "",
//     documentType: "SALES_INVOICE" as const,
//     documentId:
//       paymentReceipt.payment?.documentNumber
//         ? paymentReceipt.payment?.id || paymentReceipt.id
//         : paymentReceipt.payment?.id || paymentReceipt.id || "",
//     documentNumber:
//       paymentReceipt.payment?.documentNumber ||
//       paymentReceipt.receiptNumber ||
//       "",
//     amount: Number(paymentReceipt.amount) || 0,
//     adjustmentType: "ADVANCE" as "ADVANCE" | "INSTALLMENT",
//     adjustmentDate: new Date().toISOString().slice(0, 10),
//     remarks: "",
//     createdBy: paymentReceipt.createdBy || "Chinmaya Das",
//   });

//   useEffect(() => {
//     if (open) {
//       setInvoiceQuery(form.documentNumber || "");
//     }
//   }, [open]);

//   const matchingInvoices = useMemo(() => {
//     const q = (invoiceQuery || "").trim().toLowerCase();
//     const list = invoices ?? [];
//     if (!q) return list;
//     return list.filter(
//       (inv: any) =>
//         String(inv.id).toLowerCase().includes(q) ||
//         String(inv.invoiceNumber || "")
//           .toLowerCase()
//           .includes(q) ||
//         String(inv.customerName || "")
//           .toLowerCase()
//           .includes(q),
//     );
//   }, [invoiceQuery, invoices]);

//   const handleChange = (key: string, value: string | number) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const selectInvoice = (inv: any) => {
//     const id = String(inv.id);
//     const number = String(inv.invoiceNumber || inv.id);
//     setForm((prev) => ({
//       ...prev,
//       documentId: id,
//       documentNumber: number,
//       documentType: "SALES_INVOICE",
//     }));
//     setInvoiceQuery(number);
//     setInvoiceFocused(false);
//   };

//   const clearInvoice = () => {
//     setForm((prev) => ({
//       ...prev,
//       documentId: "",
//       documentNumber: "",
//     }));
//     setInvoiceQuery("");
//   };

// const handleSubmit = async () => {
//   try {
//     const parsed = paymentAdjustmentSchema.parse(form);

//     await createAdjustment(parsed);

//     notify.success(
//       "Payment adjustment created successfully",
//     );

//     onOpenChange(false);
//   } catch (err: any) {
//     if (err instanceof z.ZodError) {
//       notify.error(
//         err.errors[0]?.message || "Validation failed",
//       );
//     } else {
//       notify.error(
//         err?.message || "Failed to create adjustment",
//       );
//     }
//   }
// };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Payment Adjustment</DialogTitle>
//         </DialogHeader>

//         <div className="grid gap-4 py-2">
//           <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Customer</span>
//               <span className="font-medium">{paymentReceipt.customerName}</span>
//             </div>
//             <div className="mt-1 flex justify-between">
//               <span className="text-muted-foreground">Receipt</span>
//               <span className="font-medium">{paymentReceipt.receiptNumber}</span>
//             </div>
//             <div className="mt-1 flex justify-between">
//               <span className="text-muted-foreground">Original Amount</span>
//               <span className="font-medium">
//                 ₹ {Number(paymentReceipt.amount).toLocaleString("en-IN")}
//               </span>
//             </div>
//           </div>

//           {/* Invoice select */}
//           <div className="space-y-1.5">
//             <Label className="flex items-center gap-1.5">
//               <FileText className="size-3.5 text-muted-foreground" />
//               Invoice
//               <span className="text-red-500">*</span>
//             </Label>

//             <div className="relative">
//               <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 value={invoiceQuery}
//                 onFocus={() => setInvoiceFocused(true)}
//                 onBlur={() => setTimeout(() => setInvoiceFocused(false), 140)}
//                 onChange={(e) => {
//                   setInvoiceQuery(e.target.value);
//                   setInvoiceFocused(true);
//                 }}
//                 placeholder="Search invoice by number or customer"
//                 className="h-10 border-slate-200 bg-slate-50 pl-9 pr-9"
//               />

//               {invoiceQuery && (
//                 <button
//                   type="button"
//                   onClick={clearInvoice}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-slate-500 hover:bg-slate-200"
//                   aria-label="Clear invoice"
//                 >
//                   <X className="size-4" />
//                 </button>
//               )}

//               {invoiceFocused && (
//                 <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[220px] space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
//                   {invoicesLoading ? (
//                     <div className="flex items-center gap-2 px-2 py-2 text-sm text-slate-500">
//                       <Loader2 className="size-4 animate-spin" />
//                       Loading invoices...
//                     </div>
//                   ) : matchingInvoices.length ? (
//                     matchingInvoices.map((inv: any) => {
//                       const isActive =
//                         String(form.documentId) === String(inv.id);
//                       return (
//                         <button
//                           key={inv.id}
//                           type="button"
//                           onClick={() => selectInvoice(inv)}
//                           className={`flex w-full items-start gap-3 rounded-lg border p-2 text-left transition-colors ${
//                             isActive
//                               ? "border-primary/30 bg-primary/5"
//                               : "border-slate-200 bg-white hover:bg-slate-100"
//                           }`}
//                         >
//                           <span className="flex size-7 shrink-0 items-center justify-center bg-slate-100 text-[9px] font-semibold text-slate-700">
//                             {String(inv.invoiceNumber || inv.id)
//                               .slice(0, 2)
//                               .toUpperCase()}
//                           </span>
//                           <span className="min-w-0 flex-1">
//                             <span className="flex items-center justify-between gap-2">
//                               <span className="truncate text-sm font-semibold text-slate-800">
//                                 {inv.invoiceNumber || inv.id}
//                               </span>
//                               {isActive && (
//                                 <Check className="size-4 shrink-0 text-primary" />
//                               )}
//                             </span>
//                             <span className="mt-0.5 block truncate text-[11px] text-slate-500">
//                               Customer:{" "}
//                               {inv.customerName || inv.customerId || "—"}
//                             </span>
//                           </span>
//                         </button>
//                       );
//                     })
//                   ) : (
//                     <div className="px-2 py-3 text-sm text-slate-500">
//                       No invoice found.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <Label>Adjustment Type</Label>
//               <Select
//                 value={form.adjustmentType}
//                 onValueChange={(v) => handleChange("adjustmentType", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ADVANCE">Advance</SelectItem>
//                   <SelectItem value="INSTALLMENT">Installment</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-1.5">
//               <Label>Amount</Label>
//               <Input
//                 type="number"
//                 min={0}
//                 step="0.01"
//                 value={form.amount}
//                 onChange={(e) => handleChange("amount", Number(e.target.value))}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <Label>Document Number</Label>
//               <Input
//                 value={form.documentNumber}
//                 readOnly
//                 className="bg-slate-50"
//                 placeholder="Select invoice above"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <Label>Adjustment Date</Label>
//               <Input
//                 type="date"
//                 value={form.adjustmentDate}
//                 onChange={(e) => handleChange("adjustmentDate", e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="space-y-1.5">
//             <Label>Remarks</Label>
//             <Textarea
//               placeholder="Optional remarks..."
//               value={form.remarks}
//               onChange={(e) => handleChange("remarks", e.target.value)}
//               rows={3}
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Saving..." : "Create Adjustment"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }





"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Check, FileText, Loader2, Search, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { notify } from "@/lib/toast";

import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";
import { usePaymentAdjustment } from "@/modules/sales/payment-receipt/hooks/use-payment-adjustment";

import type { PaymentReceipt } from "../../types/payment-receipt.types";

// ==========================================================
// VALIDATION
// ==========================================================

const paymentAdjustmentSchema = z.object({
  businessId: z.string().min(1),
  branchId: z.string().optional(),
  customerId: z.string().min(1),
  paymentId: z.string().min(1),

  documentType: z.enum(["SALES_INVOICE"]),

  documentId: z.string().min(1, "Please select an invoice"),

  documentNumber: z
    .string()
    .min(1, "Please select an invoice"),

  amount: z.coerce.number().positive(),

  adjustmentType: z.enum([
    "ADVANCE",
    "INSTALLMENT",
  ]),

  adjustmentDate: z.string().optional(),

  remarks: z.string().optional(),

  createdBy: z.string().min(1),
});

// ==========================================================
// PROPS
// ==========================================================

interface PaymentAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentReceipt: PaymentReceipt;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function PaymentAdjustmentDialog({
  open,
  onOpenChange,
  paymentReceipt,
}: PaymentAdjustmentDialogProps) {
  const [invoiceQuery, setInvoiceQuery] = useState("");
  const [invoiceFocused, setInvoiceFocused] = useState(false);

  // ========================================================
  // INVOICE QUERY
  // ========================================================

  const {
    invoices,
    getInvoices,
    loading: invoicesLoading,
  } = useInvoiceQuery();

  // ========================================================
  // PAYMENT ADJUSTMENT
  // ========================================================

  const {
    createAdjustment,
    loading: adjustmentLoading,
  } = usePaymentAdjustment();

  // ========================================================
  // LOAD INVOICES
  // ========================================================

  useEffect(() => {
    if (open) {
      getInvoices?.();
    }
  }, [open, getInvoices]);

  // ========================================================
  // FORM
  // ========================================================

  const [form, setForm] = useState({
    businessId: paymentReceipt.businessId || "",

    branchId: paymentReceipt.branchId || "",

    customerId: paymentReceipt.customerId || "",

    paymentId: paymentReceipt.paymentId || "",

    documentType: "SALES_INVOICE" as const,

    documentId:
      paymentReceipt.payment?.documentNumber
        ? paymentReceipt.payment?.id ||
          paymentReceipt.id
        : paymentReceipt.payment?.id ||
          paymentReceipt.id ||
          "",

    documentNumber:
      paymentReceipt.payment?.documentNumber ||
      paymentReceipt.receiptNumber ||
      "",

    amount: Number(paymentReceipt.amount) || 0,

    adjustmentType:
      "ADVANCE" as "ADVANCE" | "INSTALLMENT",

    adjustmentDate: new Date()
      .toISOString()
      .slice(0, 10),

    remarks: "",

    createdBy:
      paymentReceipt.createdBy ||
      "Chinmaya Das",
  });

  // ========================================================
  // SET INVOICE SEARCH VALUE
  // ========================================================

  useEffect(() => {
    if (open) {
      setInvoiceQuery(
        form.documentNumber || "",
      );
    }
  }, [open, form.documentNumber]);

  // ========================================================
  // FILTER INVOICES
  // ========================================================

  const matchingInvoices = useMemo(() => {
    const q = (invoiceQuery || "")
      .trim()
      .toLowerCase();

    const list = invoices ?? [];

    if (!q) {
      return list;
    }

    return list.filter(
      (inv: any) =>
        String(inv.id)
          .toLowerCase()
          .includes(q) ||
        String(inv.invoiceNumber || "")
          .toLowerCase()
          .includes(q) ||
        String(inv.customerName || "")
          .toLowerCase()
          .includes(q),
    );
  }, [invoiceQuery, invoices]);

  // ========================================================
  // FORM CHANGE
  // ========================================================

  const handleChange = (
    key: string,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ========================================================
  // SELECT INVOICE
  // ========================================================

  const selectInvoice = (inv: any) => {
    const id = String(inv.id);

    const number = String(
      inv.invoiceNumber || inv.id,
    );

    setForm((prev) => ({
      ...prev,

      documentId: id,

      documentNumber: number,

      documentType: "SALES_INVOICE",
    }));

    setInvoiceQuery(number);

    setInvoiceFocused(false);
  };

  // ========================================================
  // CLEAR INVOICE
  // ========================================================

  const clearInvoice = () => {
    setForm((prev) => ({
      ...prev,

      documentId: "",

      documentNumber: "",
    }));

    setInvoiceQuery("");
  };

  // ========================================================
  // CREATE ADJUSTMENT
  // ========================================================

  const handleSubmit = async () => {
    try {
      // Validate form
      const parsed =
        paymentAdjustmentSchema.parse(form);

      // Call POST /payment-receipts/adjust
      await createAdjustment(parsed);

      notify.success(
        "Payment adjustment created successfully",
      );

      onOpenChange(false);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        notify.error(
          err.errors[0]?.message ||
            "Validation failed",
        );
      } else {
        notify.error(
          err?.message ||
            "Failed to create adjustment",
        );
      }
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Payment Adjustment
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">

          {/* =================================================
              PAYMENT RECEIPT SUMMARY
          ================================================= */}

          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Customer
              </span>

              <span className="font-medium">
                {paymentReceipt.customerName}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">
                Receipt
              </span>

              <span className="font-medium">
                {paymentReceipt.receiptNumber}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">
                Original Amount
              </span>

              <span className="font-medium">
                ₹{" "}
                {Number(
                  paymentReceipt.amount,
                ).toLocaleString("en-IN")}
              </span>
            </div>

          </div>

          {/* =================================================
              INVOICE
          ================================================= */}

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <FileText className="size-3.5 text-muted-foreground" />

              Invoice

              <span className="text-red-500">
                *
              </span>
            </Label>

            <div className="relative">

              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={invoiceQuery}
                onFocus={() =>
                  setInvoiceFocused(true)
                }
                onBlur={() =>
                  setTimeout(
                    () =>
                      setInvoiceFocused(false),
                    140,
                  )
                }
                onChange={(e) => {
                  setInvoiceQuery(
                    e.target.value,
                  );

                  setInvoiceFocused(true);
                }}
                placeholder="Search invoice by number or customer"
                className="h-10 border-slate-200 bg-slate-50 pl-9 pr-9"
              />

              {invoiceQuery && (
                <button
                  type="button"
                  onClick={clearInvoice}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-slate-500 hover:bg-slate-200"
                  aria-label="Clear invoice"
                >
                  <X className="size-4" />
                </button>
              )}

              {invoiceFocused && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[220px] space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">

                  {invoicesLoading ? (
                    <div className="flex items-center gap-2 px-2 py-2 text-sm text-slate-500">

                      <Loader2 className="size-4 animate-spin" />

                      Loading invoices...

                    </div>
                  ) : matchingInvoices.length ? (
                    matchingInvoices.map(
                      (inv: any) => {
                        const isActive =
                          String(
                            form.documentId,
                          ) ===
                          String(inv.id);

                        return (
                          <button
                            key={inv.id}
                            type="button"
                            onClick={() =>
                              selectInvoice(inv)
                            }
                            className={`flex w-full items-start gap-3 rounded-lg border p-2 text-left transition-colors ${
                              isActive
                                ? "border-primary/30 bg-primary/5"
                                : "border-slate-200 bg-white hover:bg-slate-100"
                            }`}
                          >

                            <span className="flex size-7 shrink-0 items-center justify-center bg-slate-100 text-[9px] font-semibold text-slate-700">

                              {String(
                                inv.invoiceNumber ||
                                  inv.id,
                              )
                                .slice(0, 2)
                                .toUpperCase()}

                            </span>

                            <span className="min-w-0 flex-1">

                              <span className="flex items-center justify-between gap-2">

                                <span className="truncate text-sm font-semibold text-slate-800">

                                  {inv.invoiceNumber ||
                                    inv.id}

                                </span>

                                {isActive && (
                                  <Check className="size-4 shrink-0 text-primary" />
                                )}

                              </span>

                              <span className="mt-0.5 block truncate text-[11px] text-slate-500">

                                Customer:{" "}
                                {inv.customerName ||
                                  inv.customerId ||
                                  "—"}

                              </span>

                            </span>

                          </button>
                        );
                      },
                    )
                  ) : (
                    <div className="px-2 py-3 text-sm text-slate-500">
                      No invoice found.
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* =================================================
              ADJUSTMENT TYPE + AMOUNT
          ================================================= */}

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <Label>
                Adjustment Type
              </Label>

              <Select
                value={form.adjustmentType}
                onValueChange={(v) =>
                  handleChange(
                    "adjustmentType",
                    v,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ADVANCE">
                    Advance
                  </SelectItem>

                  <SelectItem value="INSTALLMENT">
                    Installment
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                Amount
              </Label>

              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  handleChange(
                    "amount",
                    Number(e.target.value),
                  )
                }
              />
            </div>

          </div>

          {/* =================================================
              DOCUMENT NUMBER + DATE
          ================================================= */}

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <Label>
                Document Number
              </Label>

              <Input
                value={form.documentNumber}
                readOnly
                className="bg-slate-50"
                placeholder="Select invoice above"
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Adjustment Date
              </Label>

              <Input
                type="date"
                value={form.adjustmentDate}
                onChange={(e) =>
                  handleChange(
                    "adjustmentDate",
                    e.target.value,
                  )
                }
              />
            </div>

          </div>

          {/* =================================================
              REMARKS
          ================================================= */}

          <div className="space-y-1.5">
            <Label>
              Remarks
            </Label>

            <Textarea
              placeholder="Optional remarks..."
              value={form.remarks}
              onChange={(e) =>
                handleChange(
                  "remarks",
                  e.target.value,
                )
              }
              rows={3}
            />
          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={adjustmentLoading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={adjustmentLoading}
          >
            {adjustmentLoading
              ? "Saving..."
              : "Create Adjustment"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}


