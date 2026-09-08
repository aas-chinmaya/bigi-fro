import jsPDF from "jspdf";
import type { PaymentReceipt } from "../types/payment-receipt.types";

export function generatePaymentReceiptPdf(receipt: PaymentReceipt) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const m = 15;
  const contentW = pageW - m * 2;

  const amount = Number(receipt.amount ?? 0);
  const customer = (receipt as any).customer;
  const payment = receipt.payment;

  const formatDate = (v?: string | null) => {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLabel = (v?: string | null) => {
    if (!v) return "—";
    return v
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return "Zero";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
      if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
      if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
      return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    };
    return convert(Math.floor(num));
  };

  let y = m;

  // Outer border
  pdf.setDrawColor(160);
  pdf.setLineWidth(0.4);
  pdf.rect(m, m, contentW, 260);

  // Header
  pdf.setFillColor(245, 245, 245);
  pdf.rect(m, m, contentW, 18, "F");

  pdf.setFillColor(30, 30, 30);
  pdf.rect(m + 4, m + 4, 10, 10, "F");
  pdf.setTextColor(255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("A", m + 9, m + 10.5, { align: "center" });

  pdf.setTextColor(0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("AAS International", m + 17, m + 8);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(90);
  pdf.text("Bhubaneswar, Odisha", m + 17, m + 12.5);

  pdf.setFontSize(8);
  pdf.text("GSTIN: 21ABCDE1234F1Z5", pageW - m - 4, m + 10, { align: "right" });

  y = m + 18;
  pdf.setDrawColor(180);
  pdf.setLineWidth(0.3);
  pdf.line(m, y, pageW - m, y);

  // Title
  y += 9;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(0);
  pdf.text("PAYMENT RECEIPT", pageW / 2, y, { align: "center" });

  y += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(90);
  pdf.text(`Date: ${formatDate(receipt.receiptDate)}`, pageW / 2, y, { align: "center" });

  y += 5;
  pdf.setDrawColor(180);
  pdf.line(m, y, pageW - m, y);

  // Meta
  const colW = contentW / 3;
  const metaY = y;

  pdf.line(m + colW, metaY, m + colW, metaY + 14);
  pdf.line(m + colW * 2, metaY, m + colW * 2, metaY + 14);
  pdf.line(m, metaY + 14, pageW - m, metaY + 14);

  const metaItems = [
    { label: "Receipt No.", value: receipt.receiptNumber || "—" },
    { label: "Financial Year", value: receipt.financialYear || "—" },
    { label: "Status", value: formatLabel(receipt.receiptStatus) },
  ];

  metaItems.forEach((item, i) => {
    const x = m + 4 + i * colW;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(100);
    pdf.text(item.label, x, metaY + 5);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0);
    pdf.text(item.value, x, metaY + 10.5);
  });

  y = metaY + 14;

  // Section helper
  const drawSection = (title: string, rows: { label: string; value?: string | null }[]) => {
    pdf.setFillColor(245, 245, 245);
    pdf.rect(m, y, contentW, 7, "F");
    pdf.setDrawColor(180);
    pdf.line(m, y, pageW - m, y);
    pdf.line(m, y + 7, pageW - m, y + 7);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(70);
    pdf.text(title.toUpperCase(), m + 4, y + 4.8);

    y += 7;

    const validRows = rows.filter((r) => r.value);
    const rowH = 5.8;
    const sectionH = validRows.length * rowH + 4;

    validRows.forEach((row, idx) => {
      const ry = y + 4 + idx * rowH;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(100);
      pdf.text(row.label, m + 4, ry);
      pdf.setTextColor(0);
      pdf.setFont("helvetica", "bold");
      pdf.text(row.value || "—", m + 42, ry);
    });

    y += sectionH;
    pdf.setDrawColor(180);
    pdf.line(m, y, pageW - m, y);
  };

  drawSection("Received From", [
    { label: "Customer Name", value: receipt.customerName || customer?.name },
    { label: "Company", value: customer?.companyName },
    { label: "Phone", value: receipt.customerPhone || customer?.mobile },
    { label: "Email", value: customer?.email },
    { label: "GSTIN", value: receipt.customerGSTIN || customer?.gstin },
    { label: "PAN", value: customer?.pan },
  ]);

  drawSection("Payment Details", [
    { label: "Source", value: formatLabel(receipt.receiptSource) },
    { label: "Payment Method", value: formatLabel(payment?.paymentMethod || "CASH") },
    { label: "Payment No.", value: payment?.paymentNumber },
    { label: "Payment Status", value: formatLabel(payment?.paymentStatus) },
    { label: "Document No.", value: payment?.documentNumber },
  ]);

  // Amount
  pdf.setFillColor(245, 245, 245);
  pdf.rect(m, y, contentW, 16, "F");
  pdf.setDrawColor(180);
  pdf.line(m, y + 16, pageW - m, y + 16);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(70);
  pdf.text("AMOUNT RECEIVED (Rs.)", m + 4, y + 5.5);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(90);
  pdf.text(`${numberToWords(amount)} Only`, m + 4, y + 11);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(0);
  const amt = amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  pdf.text(amt, pageW - m - 4, y + 10, { align: "right" });

  y += 16;

  // Note
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(70);
  pdf.text("NOTE", m + 4, y + 5);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(90);
  pdf.text("• This is a system generated receipt. It does not require official signature.", m + 4, y + 10);
  pdf.text("• Thank You", m + 4, y + 14.5);

  y += 20;
  pdf.setDrawColor(180);
  pdf.line(m, y, pageW - m, y);

  // Signature
  y += 8;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100);
  pdf.text("Received By", m + 4, y);
  pdf.text("Authorised Signatory", pageW - m - 4, y, { align: "right" });

  y += 12;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(0);
  pdf.text(receipt.createdBy || "—", m + 4, y);

  pdf.setDrawColor(150);
  pdf.setLineWidth(0.3);
  pdf.line(pageW - m - 45, y, pageW - m - 4, y);

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

  pdf.save(`${receipt.receiptNumber ?? "payment-receipt"}.pdf`);
}