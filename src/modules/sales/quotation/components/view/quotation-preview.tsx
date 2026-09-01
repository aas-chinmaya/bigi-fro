

"use client";

export default function QuotationPreview() {
  return (
    <div className="h-full w-full overflow-auto bg-muted/30 p-2">
      <div className="mx-auto w-full max-w-[794px] bg-white shadow-sm ring-1 ring-black/5">
        {/* Quotation Header */}
        <div className="border-b px-10 py-8">
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-black text-sm font-bold text-white">
                A
              </div>

              <h1 className="text-lg font-semibold tracking-tight">
                AAS International
              </h1>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Bhubaneswar, Odisha
                <br />
                India
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                GSTIN: 21ABCDE1234F1Z5
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-semibold tracking-tight">
                QUOTATION
              </h2>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">
                    Quotation No.
                  </span>
                  <span className="font-medium">QTN-2026-001</span>
                </div>

                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">Date</span>
                  <span>01 Sep 2026</span>
                </div>

                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">
                    Valid Until
                  </span>
                  <span>15 Sep 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 border-b">
          <div className="border-r px-10 py-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quotation For
            </p>

            <p className="text-sm font-semibold">
              TechNova Solutions
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              45, Infocity Road
              <br />
              Bhubaneswar, Odisha 751024
              <br />
              India
            </p>

            <p className="mt-2 text-xs">
              GSTIN:{" "}
              <span className="font-medium">
                21AAACT1234A1ZK
              </span>
            </p>
          </div>

          <div className="px-10 py-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </p>

            <p className="text-sm font-medium">
              Rahul Sharma
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              rahul@technova.example
              <br />
              +91 98765 43210
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="px-10 py-6">
          <p className="text-xs leading-5 text-muted-foreground">
            Thank you for your interest in our services. Please find
            below our quotation based on your requirements.
          </p>
        </div>

        {/* Items */}
        <div className="px-10">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-y bg-muted/40">
                <th className="w-10 px-3 py-3 text-left font-semibold">
                  #
                </th>

                <th className="px-3 py-3 text-left font-semibold">
                  Item / Description
                </th>

                <th className="w-16 px-3 py-3 text-center font-semibold">
                  Qty
                </th>

                <th className="w-28 px-3 py-3 text-right font-semibold">
                  Rate
                </th>

                <th className="w-28 px-3 py-3 text-right font-semibold">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="px-3 py-4 text-muted-foreground">
                  01
                </td>

                <td className="px-3 py-4">
                  <p className="font-medium">
                    Website Development
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Responsive business website with modern UI
                  </p>
                </td>

                <td className="px-3 py-4 text-center">
                  1
                </td>

                <td className="px-3 py-4 text-right">
                  ₹45,000.00
                </td>

                <td className="px-3 py-4 text-right font-medium">
                  ₹45,000.00
                </td>
              </tr>

              <tr className="border-b">
                <td className="px-3 py-4 text-muted-foreground">
                  02
                </td>

                <td className="px-3 py-4">
                  <p className="font-medium">
                    UI/UX Design
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Website design and design system
                  </p>
                </td>

                <td className="px-3 py-4 text-center">
                  1
                </td>

                <td className="px-3 py-4 text-right">
                  ₹20,000.00
                </td>

                <td className="px-3 py-4 text-right font-medium">
                  ₹20,000.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end px-10 py-6">
          <div className="w-[280px] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal
              </span>
              <span>₹65,000.00</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                CGST 9%
              </span>
              <span>₹5,850.00</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                SGST 9%
              </span>
              <span>₹5,850.00</span>
            </div>

            <div className="my-3 border-t" />

            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₹76,700.00</span>
            </div>

            <p className="pt-1 text-right text-[10px] leading-4 text-muted-foreground">
              Amount in words: Seventy Six Thousand Seven Hundred
              Rupees Only
            </p>
          </div>
        </div>

        {/* Terms & Notes */}
        <div className="border-t px-10 py-6">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider">
                Terms & Conditions
              </p>

              <ol className="space-y-1.5 text-[11px] leading-4 text-muted-foreground">
                <li>1. Quotation is valid for 15 days.</li>
                <li>
                  2. 50% advance payment is required to begin work.
                </li>
                <li>
                  3. Taxes are applicable as mentioned above.
                </li>
              </ol>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider">
                Additional Notes
              </p>

              <p className="text-[11px] leading-4 text-muted-foreground">
                Project delivery timeline will be confirmed after
                approval and receipt of the advance payment.
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="border-t px-10 py-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider">
            Bank Details
          </p>

          <div className="grid grid-cols-4 gap-4 text-[11px]">
            <div>
              <p className="text-muted-foreground">Bank</p>
              <p className="mt-1 font-medium">
                State Bank of India
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">
                Account Name
              </p>
              <p className="mt-1 font-medium">
                AAS International
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">
                Account No.
              </p>
              <p className="mt-1 font-medium">
                XXXX XXXX 1234
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">IFSC</p>
              <p className="mt-1 font-medium">
                SBIN0001234
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-10 py-5 text-center">
          <p className="text-xs font-medium">
            Thank you for your business.
          </p>

          <p className="mt-1 text-[10px] text-muted-foreground">
            This is a computer-generated quotation.
          </p>
        </div>
      </div>
    </div>
  );
}