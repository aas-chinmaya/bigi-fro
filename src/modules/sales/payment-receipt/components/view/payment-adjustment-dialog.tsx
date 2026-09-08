"use client";

import { useState } from "react";
import { z } from "zod";
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
import type { PaymentReceipt } from "../../types/payment-receipt.types";

const paymentAdjustmentSchema = z.object({
  businessId: z.string().min(1),
  branchId: z.string().optional(),
  customerId: z.string().min(1),
  paymentId: z.string().min(1),
  documentType: z.enum(["SALES_INVOICE"]),
  documentId: z.string().min(1),
  documentNumber: z.string().min(1),
  amount: z.coerce.number().positive(),
  adjustmentType: z.enum(["ADVANCE", "INSTALLMENT"]),
  adjustmentDate: z.string().optional(),
  remarks: z.string().optional(),
  createdBy: z.string().min(1),
});

interface PaymentAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentReceipt: PaymentReceipt;
}

export default function PaymentAdjustmentDialog({
  open,
  onOpenChange,
  paymentReceipt,
}: PaymentAdjustmentDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessId: paymentReceipt.businessId || "",
    branchId: paymentReceipt.branchId || "",
    customerId: paymentReceipt.customerId || "",
    paymentId: paymentReceipt.paymentId || "",
    documentType: "SALES_INVOICE" as const,
    documentId: paymentReceipt.payment?.id || paymentReceipt.id,
    documentNumber:
      paymentReceipt.payment?.documentNumber ||
      paymentReceipt.receiptNumber ||
      "",
    amount: Number(paymentReceipt.amount) || 0,
    adjustmentType: "ADVANCE" as "ADVANCE" | "INSTALLMENT",
    adjustmentDate: new Date().toISOString().slice(0, 10),
    remarks: "",
    createdBy: paymentReceipt.createdBy || "Chinmaya Das",
  });

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const parsed = paymentAdjustmentSchema.parse(form);
      setLoading(true);

      // TODO: Call your adjustment API
      console.log("Adjustment payload:", parsed);

      notify.success("Payment adjustment created successfully");
      onOpenChange(false);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        notify.error(err.errors[0]?.message || "Validation failed");
      } else {
        notify.error("Failed to create adjustment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Payment Adjustment</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{paymentReceipt.customerName}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Receipt</span>
              <span className="font-medium">{paymentReceipt.receiptNumber}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Original Amount</span>
              <span className="font-medium">
                ₹ {Number(paymentReceipt.amount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Adjustment Type</Label>
              <Select
                value={form.adjustmentType}
                onValueChange={(v) => handleChange("adjustmentType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADVANCE">Advance</SelectItem>
                  <SelectItem value="INSTALLMENT">Installment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => handleChange("amount", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Document Number</Label>
              <Input
                value={form.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Adjustment Date</Label>
              <Input
                type="date"
                value={form.adjustmentDate}
                onChange={(e) => handleChange("adjustmentDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Remarks</Label>
            <Textarea
              placeholder="Optional remarks..."
              value={form.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Create Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}