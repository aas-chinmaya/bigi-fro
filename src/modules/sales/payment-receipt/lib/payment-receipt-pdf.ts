
import jsPDF from "jspdf";
import type { PaymentReceipt } from "../types/payment-receipt.types";

export function generatePaymentReceiptPdf(receipt: PaymentReceipt) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const m = 16;
  const w = pageW - m * 2;

  const amount = Number(receipt.amount ?? 0);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatDate = (v?: string | null) => {
    if (!v) return "-";

    const d = new Date(v);

    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLabel = (v?: string | null) => {
    if (!v) return "-";

    return v
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // ==========================================================
  // OUTER BORDER
  // ==========================================================

  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);

  pdf.rect(
    m,
    m,
    w,
    265
  );

  // ==========================================================
  // HEADER
  // ==========================================================

  pdf.setFillColor(0);

  pdf.rect(
    m,
    m,
    w,
    20,
    "F"
  );

  pdf.setTextColor(255);

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(16);

  pdf.text(
    "MONEY RECEIPT",
    pageW / 2,
    m + 9,
    {
      align: "center",
    }
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(8);

  pdf.text(
    "Customer Payment Receipt",
    pageW / 2,
    m + 15,
    {
      align: "center",
    }
  );

  // ==========================================================
  // META STRIP
  // ==========================================================

  let y = m + 28;

  pdf.setFillColor(245);

  pdf.rect(
    m + 2,
    y - 3,
    w - 4,
    14,
    "F"
  );

  pdf.setDrawColor(200);
  pdf.setLineWidth(0.2);

  pdf.rect(
    m + 2,
    y - 3,
    w - 4,
    14
  );

  pdf.setTextColor(0);
  pdf.setFontSize(9);

  // Receipt Number
  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.text(
    "No:",
    m + 6,
    y + 3
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.text(
    receipt.receiptNumber ?? "-",
    m + 16,
    y + 3
  );

  // Date
  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.text(
    "Date:",
    pageW / 2 - 10,
    y + 3
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.text(
    formatDate(receipt.receiptDate),
    pageW / 2 + 2,
    y + 3
  );

  // Status
  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.text(
    "Status:",
    pageW - m - 42,
    y + 3
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.text(
    formatLabel(receipt.receiptStatus),
    pageW - m - 28,
    y + 3
  );

  // ==========================================================
  // DETAILS
  // ==========================================================

  y += 20;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(10);

  pdf.text(
    "DETAILS",
    m + 4,
    y
  );

  pdf.setLineWidth(0.3);
  pdf.setDrawColor(0);

  pdf.line(
    m + 4,
    y + 1.5,
    m + 28,
    y + 1.5
  );

  y += 9;

  const left = m + 6;
  const mid = pageW / 2 + 2;
  const labelW = 38;

  // ==========================================================
  // ROW HELPER
  // ==========================================================

  const row = (
    label: string,
    value: string,
    x: number,
    cy: number
  ) => {
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(8.5);

    pdf.setTextColor(60);

    pdf.text(
      label,
      x,
      cy
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setTextColor(0);

    pdf.text(
      value,
      x + labelW,
      cy
    );
  };

  // Customer
  row(
    "Customer",
    receipt.customerName ?? "-",
    left,
    y
  );

  // Customer ID
  if (receipt.customerId) {
    y += 6;

    row(
      "Customer ID",
      receipt.customerId,
      left,
      y
    );
  }

  // Receipt Status
  y += 6;

  row(
    "Receipt Status",
    formatLabel(receipt.receiptStatus ?? "RECEIVED"),
    left,
    y
  );

  // Receipt Source
  y += 6;

  row(
    "Receipt Source",
    formatLabel(receipt.receiptSource ?? "POS"),
    left,
    y
  );

  // Financial Year
  const ry =
    y -
    (receipt.customerId
      ? 18
      : 12);

  row(
    "Financial Year",
    receipt.financialYear ?? "-",
    mid,
    ry
  );

  // ==========================================================
  // AMOUNT SECTION
  // ==========================================================

  y += 12;

  pdf.setDrawColor(0);
  pdf.setLineWidth(0.6);

  pdf.setFillColor(248);

  pdf.roundedRect(
    m + 4,
    y,
    w - 8,
    18,
    1.5,
    1.5,
    "FD"
  );

  // Amount Label
  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(10);

  pdf.setTextColor(0);

  pdf.text(
    "Amount Received",
    m + 10,
    y + 7
  );

  // Amount
  pdf.setFontSize(14);

  const formattedAmount =
    amount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const amountText =
    `Rs. ${formattedAmount}`;

  pdf.text(
    amountText,
    pageW - m - 10,
    y + 12,
    {
      align: "right",
    }
  );

  // ==========================================================
  // REMARKS
  // ==========================================================

  y += 26;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(10);

  pdf.text(
    "REMARKS",
    m + 4,
    y
  );

  pdf.setLineWidth(0.3);

  pdf.line(
    m + 4,
    y + 1.5,
    m + 26,
    y + 1.5
  );

  y += 7;

  const remarks =
    receipt.remarks ?? "-";

  const lines =
    pdf.splitTextToSize(
      remarks,
      w - 14
    );

  const rh = Math.max(
    16,
    lines.length * 4.5 + 6
  );

  pdf.setDrawColor(200);
  pdf.setLineWidth(0.2);

  pdf.setFillColor(252);

  pdf.rect(
    m + 4,
    y,
    w - 8,
    rh,
    "FD"
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(8.5);

  pdf.setTextColor(50);

  pdf.text(
    lines,
    m + 8,
    y + 5
  );

  // ==========================================================
  // FOOTER
  // ==========================================================

  const fy = 272;

  pdf.setDrawColor(200);
  pdf.setLineWidth(0.2);

  pdf.line(
    m + 4,
    fy - 4,
    pageW - m - 4,
    fy - 4
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(7.5);

  pdf.setTextColor(120);

  pdf.text(
    "This is a system generated money receipt.",
    pageW / 2,
    fy,
    {
      align: "center",
    }
  );

  // ==========================================================
  // AUTHORIZED SIGNATORY
  // ==========================================================

  pdf.setFontSize(8);

  pdf.setTextColor(60);

  pdf.text(
    "Authorized Signatory",
    pageW - m - 22,
    fy - 14,
    {
      align: "center",
    }
  );

  pdf.setDrawColor(140);

  pdf.line(
    pageW - m - 45,
    fy - 17,
    pageW - m - 5,
    fy - 17
  );

  // ==========================================================
  // SAVE PDF
  // ==========================================================

  pdf.save(
    `${receipt.receiptNumber ?? "money-receipt"}.pdf`
  );
}

