"use client";

import {
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";

// ==========================================================
// DUMMY DATA
// ==========================================================

const quotation = {
  quotationNumber: "A00001",
  quotationDate: "Sep 01, 2026",
  validTill: "Sep 16, 2026",

  company: {
    name: "AAS International Pvt Ltd",
    address: "Plot 52, 2nd floor, Bapuji Nagar, Unit 1, Bhubaneswar, Odisha, India - 751009",
    gstin: "21ABACA8267F1ZX",
    pan: "ABACA8267F",
  },

  customer: {
    name: "21ABACA8267F1ZX",
    address:
      "Janpath, Ashok Nagar, Bhubaneswar, Odisha, India - 751009",
    gstin: "21AAAACH7056C1Z5",
    pan: "AAAACH7056C",
    email: "info@swostigrand.com",
    phone: "+91 674 253 0100",
  },

  items: [
    {
      no: 1,
      name: "Hotel Website Development",
      description:
        "Design and development of a responsive hotel website with room details, gallery, contact forms, and booking enquiry functionality.",
      hsn: "998314",
      gstRate: 18,
      quantity: 1,
      unit: "lic",
      rate: 150000,
    },
    {
      no: 2,
      name: "Software Implementation & Setup",
      description:
        "Installation, configuration, initial setup, and deployment of the hotel management software.",
      hsn: "998314",
      gstRate: 18,
      quantity: 1,
      unit: "lic",
      rate: 50000,
    },
    {
      no: 3,
      name: "Annual Software Support & Maintenance",
      description: "",
      hsn: "998314",
      gstRate: 18,
      quantity: 1,
      unit: "yer",
      rate: 30000,
    },
  ],

  totalInWords:
    "Two Lakh Seventy One Thousand Four Hundred Rupees Only",
};

// ==========================================================
// HELPERS
// ==========================================================

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getItemAmount(
  quantity: number,
  rate: number,
) {
  return quantity * rate;
}

function getTax(
  quantity: number,
  rate: number,
  gstRate: number,
) {
  return getItemAmount(quantity, rate) * (gstRate / 100);
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function QuotationView() {
  const subtotal = quotation.items.reduce(
    (sum, item) =>
      sum +
      getItemAmount(
        item.quantity,
        item.rate,
      ),
    0,
  );

  const igst = quotation.items.reduce(
    (sum, item) =>
      sum +
      getTax(
        item.quantity,
        item.rate,
        item.gstRate,
      ),
    0,
  );

  const grandTotal = subtotal + igst;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      {/* ================================================== */}
      {/* DOCUMENT */}
      {/* ================================================== */}

      <div
        id="quotation-document"
        className="mx-auto w-full max-w-[1000px] bg-white p-8 shadow-sm"
      >
        {/* ================================================== */}
        {/* DOCUMENT HEADER */}
        {/* ================================================== */}

        <div className="border border-slate-800">
          <div className="flex min-h-[118px] items-center justify-between px-8 py-6">
            {/* LOGO */}

            <div className="flex h-[82px] w-[125px] items-center justify-center">
              <div className="text-center">
                <div className="font-serif text-[48px] leading-none tracking-[-8px] text-[#b4a35b]">
                  AAS
                </div>
              </div>
            </div>

            {/* TITLE */}

            <div className="flex items-center gap-3">
              <span className="text-[20px] font-normal text-slate-700">
                Quotation
              </span>

              <span className="rounded-md bg-orange-500 px-2.5 py-1 text-[12px] font-semibold text-white">
                Created
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* COMPANY / CUSTOMER INFORMATION */}
          {/* ================================================== */}

          <div className="grid grid-cols-[1fr_1.25fr_1.25fr] border-t border-slate-800">
            {/* LEFT */}

            <div className="border-r border-slate-800 p-2">
              <InfoRow
                label="Quotation No"
                value={quotation.quotationNumber}
                bold
              />

              <InfoRow
                label="Quotation Date"
                value={quotation.quotationDate}
                bold
              />

              <InfoRow
                label="Valid Till Date"
                value={quotation.validTill}
                bold
              />

              <InfoRow
                label="Country of Supply"
                value="India"
                bold
              />

              <InfoRow
                label="Place of Supply"
                value="Odisha (21)"
                bold
              />
            </div>

            {/* COMPANY */}

            <div className="border-r border-slate-800 p-2">
              <div className="text-[11px] text-slate-700">
                Quotation From
              </div>

              <div className="mt-1 text-[13px] font-bold text-slate-800">
                {quotation.company.name}
              </div>

              <div className="mt-1 max-w-[290px] text-[11px] leading-[1.45] text-slate-700">
                {quotation.company.address}
              </div>

              <div className="mt-2 text-[11px] text-slate-700">
                <span className="font-medium">
                  GSTIN:
                </span>{" "}
                {quotation.company.gstin}
              </div>

              <div className="mt-1 text-[11px] text-slate-700">
                <span className="font-medium">
                  PAN:
                </span>{" "}
                {quotation.company.pan}
              </div>
            </div>

            {/* CUSTOMER */}

            <div className="p-2">
              <div className="text-[11px] text-slate-700">
                Quotation For
              </div>

              <div className="mt-1 text-[13px] font-bold text-slate-800">
                {quotation.customer.name}
              </div>

              <div className="mt-1 max-w-[290px] text-[11px] leading-[1.45] text-slate-700">
                {quotation.customer.address}
              </div>

              <div className="mt-2 text-[11px] text-slate-700">
                <span className="font-medium">
                  GSTIN:
                </span>{" "}
                {quotation.customer.gstin}
              </div>

              <div className="mt-1 text-[11px] text-slate-700">
                <span className="font-medium">
                  PAN:
                </span>{" "}
                {quotation.customer.pan}
              </div>

              <div className="mt-1 text-[11px] text-slate-700">
                <span className="font-medium">
                  Email:
                </span>{" "}
                {quotation.customer.email}
              </div>

              <div className="mt-1 text-[11px] text-slate-700">
                <span className="font-medium">
                  Phone:
                </span>{" "}
                {quotation.customer.phone}
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* ITEMS TABLE */}
          {/* ================================================== */}

          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-t border-slate-800">
                <th className="w-[28px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
                  #
                </th>

                <th className="border-r border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                  Item
                </th>

                <th className="w-[62px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
                  HSN/SAC
                </th>

                <th className="w-[48px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
                  GST
                  <br />
                  Rate
                </th>

                <th className="w-[55px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
                  Quantity
                </th>

                <th className="w-[43px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
                  Unit
                </th>

                <th className="w-[82px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                  Rate
                </th>

                <th className="w-[100px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                  Amount
                </th>

                <th className="w-[100px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                  IGST
                </th>

                <th className="w-[100px] border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {quotation.items.map((item) => {
                const amount = getItemAmount(
                  item.quantity,
                  item.rate,
                );

                const tax = getTax(
                  item.quantity,
                  item.rate,
                  item.gstRate,
                );

                return (
                  <tr key={item.no}>
                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                      {item.no}.
                    </td>

                    <td className="border-r border-b border-slate-800 px-2 py-1.5 align-top">
                      <div className="font-semibold text-slate-800">
                        {item.name}
                      </div>

                      {item.description && (
                        <div className="mt-0.5 leading-[1.4] text-slate-700">
                          {item.description}
                        </div>
                      )}
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                      {item.hsn}
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                      {item.gstRate}%
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                      {item.quantity}
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                      {item.unit}
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top">
                      {formatCurrency(item.rate)}
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top">
                      {formatCurrency(amount)}
                    </td>

                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top">
                      {formatCurrency(tax)}
                    </td>

                    <td className="border-b border-slate-800 px-1 py-1.5 text-right align-top">
                      {formatCurrency(amount + tax)}
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY SPACE */}

              <tr>
                <td
                  colSpan={10}
                  className="h-[30px] border-b border-slate-800"
                />
              </tr>
            </tbody>
          </table>

          {/* ================================================== */}
          {/* TOTALS */}
          {/* ================================================== */}

          <div className="grid grid-cols-[1fr_340px]">
            {/* EMPTY LEFT */}

            <div />

            {/* TOTAL BOX */}

            <div className="border-l border-slate-800">
              <div className="flex justify-end border-b border-slate-800">
                <span className="w-[185px] px-2 py-1 text-right font-medium">
                  Amount
                </span>

                <span className="w-[105px] px-2 py-1 text-right font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-end border-b border-slate-800">
                <span className="w-[185px] px-2 py-1 text-right font-medium">
                  IGST
                </span>

                <span className="w-[105px] px-2 py-1 text-right font-semibold">
                  {formatCurrency(igst)}
                </span>
              </div>

              <div className="flex justify-end">
                <span className="w-[185px] px-2 py-1 text-right font-semibold">
                  Total (INR)
                </span>

                <span className="w-[105px] px-2 py-1 text-right font-bold">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* WORDS + SIGNATURE */}
          {/* ================================================== */}

          <div className="grid grid-cols-[1.25fr_1fr] border-t border-slate-800">
            <div className="min-h-[100px] border-r border-slate-800 p-2">
              <div className="text-[11px] font-medium">
                Total (in words) :
              </div>

              <div className="mt-0.5 text-[11px]">
                {quotation.totalInWords}
              </div>
            </div>

            <div className="relative min-h-[100px] p-2">
              <div className="absolute bottom-2 right-8 text-center">
                <div className="mb-1 font-serif text-[34px] italic text-slate-700">
                  Signature
                </div>

                <div className="border-t border-slate-400 px-5 pt-1 text-[9px] text-slate-500">
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
          <span>
            This is a computer generated quotation.
          </span>

          <span>
            {quotation.quotationNumber}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// INFO ROW
// ==========================================================

function InfoRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="grid grid-cols-[145px_1fr] text-[11px] leading-[1.55]">
      <span>{label}:</span>

      <span
        className={
          bold
            ? "font-semibold text-slate-800"
            : "text-slate-700"
        }
      >
        {value}
      </span>
    </div>
  );
}