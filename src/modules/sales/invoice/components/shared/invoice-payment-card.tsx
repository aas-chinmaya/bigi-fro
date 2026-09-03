// "use client";

// import { Controller, useFormContext, useWatch } from "react-hook-form";
// import {
//   BadgeIndianRupee,
//   CalendarDays,
//   CreditCard,
//   Hash,
//   Wallet,
// } from "lucide-react";
// import { useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import type { InvoiceFormValues } from "../../types/invoice-form.types";

// const methods = [
//   "Cash",
//   "Bank Transfer",
//   "UPI",
//   "Credit Card",
//   "Cheque",
// ];

// const statuses = [
//   "Pending",
//   "Paid",
//   "Partially Paid",
//   "Overdue",
// ];

// export default function InvoicePaymentCard() {
//   const { control, register,  setError,
//   clearErrors } =
//     useFormContext<InvoiceFormValues>();
// const grandTotal = useWatch({
//   control,
//   name: "grandTotal",
// }) ?? 0;

// const paidAmount = useWatch({
//   control,
//   name: "paidAmount",
// });   
//   const paymentMethod = useWatch({
//     control,
//     name: "paymentMethod",
//   });
// const paymentStatus = useWatch({
//   control,
//   name: "paymentStatus",
// });
//   const showTransactionReference =
//     paymentMethod && paymentMethod !== "Cash";
// useEffect(() => {
//   const paid = Number(paidAmount || 0);
//   const total = Number(grandTotal || 0);

//   if (paid > total) {
//     setError("paidAmount", {
//       type: "validate",
//       message: `Paid amount cannot exceed invoice total (₹${total.toFixed(2)})`,
//     });
//   } else {
//     clearErrors("paidAmount");
//   }
// }, [
//   paidAmount,
//   grandTotal,
//   setError,
//   clearErrors,
// ]);
//   return (
//     <section className="min-w-0">
//       <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
//         <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
//           <CreditCard className="size-4" />
//         </span>

//         <h2 className="text-sm font-semibold text-gray-900">
//           Payment details
//         </h2>
//       </div>

//       <div className="divide-y divide-gray-100">
//         {/* Payment Method */}
//         <Row label="Payment method">
//           <Controller
//             control={control}
//             name="paymentMethod"
//             render={({ field }) => (
//               <Select
//                 value={field.value || undefined}
//                 onValueChange={field.onChange}
//               >
//                 <IconSelectTrigger icon={Wallet}>
//                   <SelectValue placeholder="Select method" />
//                 </IconSelectTrigger>

//                 <SelectContent>
//                   {methods.map((method) => (
//                     <SelectItem
//                       key={method}
//                       value={method}
//                     >
//                       {method}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         </Row>

//         {/* Payment Status */}
//         <Row label="Payment status">
//           <Controller
//             control={control}
//             name="paymentStatus"
//             render={({ field }) => (
//               <Select
//                 value={field.value || "Pending"}
//                 onValueChange={field.onChange}
//               >
//                 <IconSelectTrigger icon={BadgeIndianRupee}>
//                   <SelectValue />
//                 </IconSelectTrigger>

//                 <SelectContent>
//                   {statuses.map((status) => (
//                     <SelectItem
//                       key={status}
//                       value={status}
//                     >
//                       {status}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         </Row>

//         {/* Payment Date */}
//         <Row label="Payment date">
//           <div className="relative">
//             <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//             <Input
//               type="date"
//               className="pl-9"
//               {...register("paymentDate")}
//             />
//           </div>
//         </Row>

// {/* Paid Amount */}
// {paymentStatus !== "Pending" && (
//   <Row label="Paid amount">
//     <div className="relative">
//       <BadgeIndianRupee className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//       <Input
//         type="number"
//         min="0"
//         max={grandTotal ?? 0}
//         step="0.01"
//         inputMode="decimal"
//         placeholder="0.00"
//         className="pl-9"
//         {...register("paidAmount", {
//           valueAsNumber: true,

//           validate: (value) => {
//             const paid = Number(value || 0);
//             const total = Number(grandTotal || 0);

//             if (paid < 0) {
//               return "Paid amount cannot be negative";
//             }

//             if (paid > total) {
//               return `Paid amount cannot exceed invoice total (₹${total.toFixed(2)})`;
//             }

//             return true;
//           },
//         })}
//       />
//     </div>
//   </Row>
// )}

//         {/* Transaction Reference */}
//         {showTransactionReference && (
//           <Row label="Transaction reference">
//             <div className="relative">
//               <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//               <Input
//                 placeholder="Enter transaction reference"
//                 className="pl-9"
//                 {...register("transactionId")}
//               />
//             </div>
//           </Row>
//         )}
//       </div>
//     </section>
//   );
// }

// function IconSelectTrigger({
//   icon: Icon,
//   children,
// }: {
//   icon: React.ComponentType<{ className?: string }>;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="relative min-w-0">
//       <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

//       <SelectTrigger className="pl-9">
//         {children}
//       </SelectTrigger>
//     </div>
//   );
// }

// function Row({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="grid min-w-0 grid-cols-1 items-start gap-1.5 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
//       <Label className="text-xs font-medium text-muted-foreground sm:pt-2.5">
//         {label}
//       </Label>

//       <div className="min-w-0">
//         {children}
//       </div>
//     </div>
//   );
// }




"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  BadgeIndianRupee,
  CalendarDays,
  CreditCard,
  Hash,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { InvoiceFormValues } from "../../types/invoice-form.types";

const methods = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Credit Card",
  "Cheque",
];

const statuses = [
  "Pending",
  "Paid",
  "Partially Paid",
  "Overdue",
];

export default function InvoicePaymentCard() {
  const {
    control,
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const grandTotal = useWatch({
    control,
    name: "grandTotal",
  }) ?? 0;

  const paidAmount = useWatch({
    control,
    name: "paidAmount",
  });

  const paymentMethod = useWatch({
    control,
    name: "paymentMethod",
  });

  const paymentStatus = useWatch({
    control,
    name: "paymentStatus",
  });

  const showTransactionReference =
    paymentMethod && paymentMethod !== "Cash";

  // ========================================================
  // DEFAULT STATUS
  // ========================================================
  //
  // The Select below visually defaults to "Pending" via
  // `value={field.value || "Pending"}`, but that's display
  // only — if the user never touches the dropdown,
  // values.paymentStatus stays undefined in the form and
  // never reaches the payload. Push the real default into
  // form state once, on mount.
  // ========================================================

  useEffect(() => {
    if (!paymentStatus) {
      setValue("paymentStatus", "Pending", {
        shouldValidate: false,
      });
    }
    // Intentionally run once on mount — we only want to seed
    // the default, not fight the user's own selection later.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========================================================
  // PAID AMOUNT VALIDATION
  // ========================================================
  //
  // This is the single source of truth for paidAmount's
  // error state (no duplicate `validate` rule on the
  // register call below), so it can react to grandTotal
  // changing even when paidAmount itself doesn't.
  //
  // It also clears the field back to 0 whenever status is
  // (or reverts to) "Pending", so a stale amount can't leak
  // into the submit payload from an unmounted input.
  // ========================================================

  useEffect(() => {
    if (!paymentStatus || paymentStatus === "Pending") {
      if (Number(paidAmount || 0) !== 0) {
        setValue("paidAmount", 0, {
          shouldValidate: false,
        });
      }

      clearErrors("paidAmount");

      return;
    }

    const paid = Number(paidAmount || 0);
    const total = Number(grandTotal || 0);

    if (paid < 0) {
      setError("paidAmount", {
        type: "validate",
        message: "Paid amount cannot be negative",
      });
    } else if (paid > total) {
      setError("paidAmount", {
        type: "validate",
        message: `Paid amount cannot exceed invoice total (₹${total.toFixed(2)})`,
      });
    } else {
      clearErrors("paidAmount");
    }
  }, [
    paymentStatus,
    paidAmount,
    grandTotal,
    setValue,
    setError,
    clearErrors,
  ]);

  return (
    <section className="min-w-0">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <CreditCard className="size-4" />
        </span>

        <h2 className="text-sm font-semibold text-gray-900">
          Payment details
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Payment Method */}
        <Row label="Payment method">
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <IconSelectTrigger icon={Wallet}>
                  <SelectValue placeholder="Select method" />
                </IconSelectTrigger>

                <SelectContent>
                  {methods.map((method) => (
                    <SelectItem
                      key={method}
                      value={method}
                    >
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Row>

        {/* Payment Status */}
        <Row label="Payment status">
          <Controller
            control={control}
            name="paymentStatus"
            render={({ field }) => (
              <Select
                value={field.value || "Pending"}
                onValueChange={field.onChange}
              >
                <IconSelectTrigger icon={BadgeIndianRupee}>
                  <SelectValue />
                </IconSelectTrigger>

                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Row>

        {/* Payment Date */}
        <Row label="Payment date">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="date"
              className="pl-9"
              {...register("paymentDate")}
            />
          </div>
        </Row>

        {/* Paid Amount */}
        {paymentStatus !== "Pending" && (
          <Row label="Paid amount">
            <div className="relative">
              <BadgeIndianRupee className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="number"
                min="0"
                // No `max` attribute here on purpose — some browsers
                // clamp or block typed input against `max`, which
                // stops the user from entering a value at all. We
                // want typing to always be allowed; the useEffect
                // above sets a form error instead, shown below.
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                aria-invalid={
                  errors.paidAmount ? "true" : "false"
                }
                className={`pl-9 ${
                  errors.paidAmount
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                {...register("paidAmount", {
                  valueAsNumber: true,
                  // No inline `validate` rule here — the useEffect
                  // above is the single source of truth for this
                  // field's error state, since it also needs to
                  // react to grandTotal changing on its own.
                })}
              />
            </div>

            {errors.paidAmount?.message && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {String(errors.paidAmount.message)}
              </p>
            )}
          </Row>
        )}

        {/* Transaction Reference */}
        {showTransactionReference && (
          <Row label="Transaction reference">
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Enter transaction reference"
                className="pl-9"
                {...register("transactionId")}
              />
            </div>
          </Row>
        )}
      </div>
    </section>
  );
}

function IconSelectTrigger({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

      <SelectTrigger className="pl-9">
        {children}
      </SelectTrigger>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-1.5 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
      <Label className="text-xs font-medium text-muted-foreground sm:pt-2.5">
        {label}
      </Label>

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}