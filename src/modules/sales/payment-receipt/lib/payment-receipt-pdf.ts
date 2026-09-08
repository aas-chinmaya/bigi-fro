






import jsPDF from "jspdf";
import type { PaymentReceipt } from "../types/payment-receipt.types";

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLabel(v?: string | null) {
  if (!v) return "—";
  return v
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + convert(n % 10000000) : "")
    );
  };
  return convert(Math.floor(num));
}

/** Builds the PDF document (shared by download + print). No company header. */
export function buildPaymentReceiptPdf(receipt: PaymentReceipt): jsPDF {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const m = 18; // consistent padding
  const contentW = pageW - m * 2;

  const amount = Number(receipt.amount ?? 0);
  const customer = (receipt as any).customer;
  const payment = receipt.payment;

  let y = m;

  // Outer border with proper inset
  pdf.setDrawColor(160);
  pdf.setLineWidth(0.4);
  pdf.rect(m, m, contentW, 260);

  // Title — starts with padding (no company header)
  y = m + 12;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0);
  pdf.text("PAYMENT RECEIPT", pageW / 2, y, { align: "center" });

  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(90);
  pdf.text(`Date: ${formatDate(receipt.receiptDate)}`, pageW / 2, y, {
    align: "center",
  });

  y += 6;
  pdf.setDrawColor(180);
  pdf.setLineWidth(0.3);
  pdf.line(m, y, pageW - m, y);

  // Meta row
  const colW = contentW / 3;
  const metaY = y;
  const metaH = 14;

  pdf.line(m + colW, metaY, m + colW, metaY + metaH);
  pdf.line(m + colW * 2, metaY, m + colW * 2, metaY + metaH);
  pdf.line(m, metaY + metaH, pageW - m, metaY + metaH);

  const metaItems = [
    { label: "Receipt No.", value: receipt.receiptNumber || "—" },
    { label: "Financial Year", value: receipt.financialYear || "—" },
    { label: "Status", value: formatLabel(receipt.receiptStatus) },
  ];

  metaItems.forEach((item, i) => {
    const x = m + 5 + i * colW;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(100);
    pdf.text(item.label, x, metaY + 5);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0);
    pdf.text(String(item.value), x, metaY + 10.5);
  });

  y = metaY + metaH;

  // Section helper
  const drawSection = (
    title: string,
    rows: { label: string; value?: string | null }[],
  ) => {
    pdf.setFillColor(245, 245, 245);
    pdf.rect(m, y, contentW, 7, "F");
    pdf.setDrawColor(180);
    pdf.line(m, y, pageW - m, y);
    pdf.line(m, y + 7, pageW - m, y + 7);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(70);
    pdf.text(title.toUpperCase(), m + 5, y + 4.8);

    y += 7;

    const validRows = rows.filter((r) => r.value);
    const rowH = 6;
    const sectionH = Math.max(validRows.length * rowH + 4, 8);

    validRows.forEach((row, idx) => {
      const ry = y + 4.5 + idx * rowH;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(100);
      pdf.text(row.label, m + 5, ry);
      pdf.setTextColor(0);
      pdf.setFont("helvetica", "bold");
      pdf.text(row.value || "—", m + 48, ry);
    });

    y += sectionH;
    pdf.setDrawColor(180);
    pdf.line(m, y, pageW - m, y);
  };

  drawSection("Received From", [
    {
      label: "Customer Name",
      value: receipt.customerName || customer?.name,
    },
    { label: "Company", value: customer?.companyName },
    {
      label: "Phone",
      value: receipt.customerPhone || customer?.mobile,
    },
    { label: "Email", value: customer?.email },
    {
      label: "GSTIN",
      value: receipt.customerGSTIN || customer?.gstin,
    },
    { label: "PAN", value: customer?.pan },
  ]);

  drawSection("Payment Details", [
    { label: "Source", value: formatLabel(receipt.receiptSource) },
    {
      label: "Payment Method",
      value: formatLabel(payment?.paymentMethod || "CASH"),
    },
    { label: "Payment No.", value: payment?.paymentNumber },
    {
      label: "Payment Status",
      value: formatLabel(payment?.paymentStatus),
    },
    { label: "Document No.", value: payment?.documentNumber },
  ]);

  // Amount block
  pdf.setFillColor(245, 245, 245);
  pdf.rect(m, y, contentW, 16, "F");
  pdf.setDrawColor(180);
  pdf.line(m, y + 16, pageW - m, y + 16);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(70);
  pdf.text("AMOUNT RECEIVED (Rs.)", m + 5, y + 5.5);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(90);
  pdf.text(`${numberToWords(amount)} Only`, m + 5, y + 11.5);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(0);
  const amt = amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  pdf.text(amt, pageW - m - 5, y + 10, { align: "right" });

  y += 16;


 

  // Signature
  y += 10;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100);
  pdf.text("Received By", m + 5, y);
  pdf.text("Authorised Signatory", pageW - m - 5, y, { align: "right" });

  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(0);
  pdf.text(receipt.createdBy || "—", m + 5, y);

  pdf.setDrawColor(150);
  pdf.setLineWidth(0.3);
  pdf.line(pageW - m - 48, y, pageW - m - 5, y);

  // Footer
  const footerY = 275;
  pdf.setDrawColor(180);
  pdf.setLineWidth(0.3);
  pdf.line(m + 4, footerY - 4, pageW - m - 4, footerY - 4);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(110);
  pdf.text("This is a computer-generated money receipt.", pageW / 2, footerY, {
    align: "center",
  });

  return pdf;
}

/** Download the receipt as a PDF file. */
export function generatePaymentReceiptPdf(receipt: PaymentReceipt) {
  const pdf = buildPaymentReceiptPdf(receipt);
  pdf.save(`${receipt.receiptNumber ?? "payment-receipt"}.pdf`);
}

/**
 * Print the receipt PDF in the same window (no new tab).
 * Uses a hidden iframe so the browser print dialog opens in-place.
 */
export function printPaymentReceiptPdf(receipt: PaymentReceipt) {
  const pdf = buildPaymentReceiptPdf(receipt);
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);

  // Reuse a single hidden iframe — never opens a new tab
  const iframeId = "payment-receipt-print-frame";
  let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = iframeId;
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);
  }

  const cleanup = () => {
    URL.revokeObjectURL(url);
  };

  iframe.onload = () => {
    try {
      iframe?.contentWindow?.focus();
      iframe?.contentWindow?.print();
    } catch {
      // ignore
    }
    setTimeout(cleanup, 1500);
  };

  iframe.src = url;

  // Safety cleanup
  setTimeout(cleanup, 10000);
}









