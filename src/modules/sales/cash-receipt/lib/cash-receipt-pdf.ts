import jsPDF from "jspdf";

import type { CashReceipt } from "../types/cash-receipt.types";

export function generateCashReceiptPdf(
  receipt: CashReceipt,
) {
  const pdf = new jsPDF();

  const amount = Number(
    receipt.amount ?? 0,
  );

  const formatDate = (
    value?: string | null,
  ) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLabel = (
    value?: string | null,
  ) => {
    if (!value) return "-";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase(),
      );
  };

  /* -----------------------------
     Header
  ----------------------------- */

  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");

  pdf.text("CASH RECEIPT", 105, 25, {
    align: "center",
  });

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  pdf.text(
    "Customer Payment Receipt",
    105,
    32,
    {
      align: "center",
    },
  );

  /* -----------------------------
     Receipt Information
  ----------------------------- */

  let y = 50;

  pdf.setFontSize(11);

  const addRow = (
    label: string,
    value: string,
  ) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(label, 20, y);

    pdf.setFont("helvetica", "normal");
    pdf.text(value, 70, y);

    y += 10;
  };

  addRow(
    "Receipt No:",
    receipt.receiptNo ?? "-",
  );

  addRow(
    "Receipt Date:",
    formatDate(receipt.receiptDate),
  );

  addRow(
    "Customer:",
    receipt.customerName ?? "-",
  );

  addRow(
    "Receipt Type:",
    formatLabel(receipt.receiptType),
  );

  addRow(
    "Payment Method:",
    formatLabel(
      receipt.paymentMethod,
    ),
  );

  addRow(
    "Account:",
    receipt.accountName ??
      receipt.accountId ??
      "-",
  );

  addRow(
    "Reference No:",
    receipt.referenceNo ?? "-",
  );

  addRow(
    "Status:",
    formatLabel(receipt.status),
  );

  /* -----------------------------
     Amount
  ----------------------------- */

  y += 5;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");

  pdf.text("Amount Received:", 20, y);

  pdf.text(
    `Rs. ${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    190,
    y,
    {
      align: "right",
    },
  );

  /* -----------------------------
     Remarks
  ----------------------------- */

  y += 20;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");

  pdf.text("Remarks", 20, y);

  y += 8;

  pdf.setFont("helvetica", "normal");

  const remarks = receipt.remarks ?? "-";

  const wrappedRemarks =
    pdf.splitTextToSize(
      remarks,
      170,
    );

  pdf.text(
    wrappedRemarks,
    20,
    y,
  );

  /* -----------------------------
     Footer
  ----------------------------- */

  pdf.setFontSize(9);
  pdf.setTextColor(100);

  pdf.text(
    "This is a system generated cash receipt.",
    105,
    285,
    {
      align: "center",
    },
  );

  /* -----------------------------
     Download
  ----------------------------- */

  pdf.save(
    `${receipt.receiptNo ?? "cash-receipt"}.pdf`,
  );
}