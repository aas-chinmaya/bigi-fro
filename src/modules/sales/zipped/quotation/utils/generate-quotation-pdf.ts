import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { formatCurrency, formatDate } from "../lib/format";
import type { Quotation } from "../types/quotation.types";

const PRIMARY = "#4f46e5";
const TEXT_MUTED = "#6b7280";

function buildDocument(quotation: Quotation): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  let cursorY = 50;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(PRIMARY);
  doc.text("QUOTATION", marginX, cursorY);

  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED);
  doc.text(
    quotation.quotationNumber ? `#${quotation.quotationNumber}` : "Draft",
    marginX,
    cursorY + 16,
  );

  doc.text(`Status: ${quotation.status}`, 420, cursorY, { align: "left" });
  doc.text(`Date: ${formatDate(quotation.quotationDate)}`, 420, cursorY + 16);
  if (quotation.validUntil) {
    doc.text(`Valid until: ${formatDate(quotation.validUntil)}`, 420, cursorY + 32);
  }

  cursorY += 60;

  // Customer block
  doc.setTextColor("#111827");
  doc.setFontSize(11);
  doc.text("Billed to", marginX, cursorY);
  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED);
  cursorY += 16;
  doc.text(quotation.customerName || "-", marginX, cursorY);
  if (quotation.customerPhone) {
    cursorY += 14;
    doc.text(quotation.customerPhone, marginX, cursorY);
  }
  if (quotation.customerEmail) {
    cursorY += 14;
    doc.text(quotation.customerEmail, marginX, cursorY);
  }
  if (quotation.customerGSTIN) {
    cursorY += 14;
    doc.text(`GSTIN: ${quotation.customerGSTIN}`, marginX, cursorY);
  }

  cursorY += 30;

  // Items table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [["#", "Item", "Qty", "Rate", "Discount", "Tax", "Amount"]],
    body: (quotation.items || []).map((item, index) => [
      String(index + 1),
      item.productName + (item.description ? `\n${item.description}` : ""),
      String(item.quantity),
      formatCurrency(item.rate),
      item.discountType === "PERCENTAGE"
        ? `${item.discountValue}%`
        : formatCurrency(item.discountValue),
      `${item.taxRate}%`,
      formatCurrency(item.amount ?? item.quantity * item.rate),
    ]),
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 24 },
      2: { cellWidth: 40, halign: "right" },
      3: { cellWidth: 60, halign: "right" },
      4: { cellWidth: 60, halign: "right" },
      5: { cellWidth: 40, halign: "right" },
      6: { cellWidth: 70, halign: "right" },
    },
  });

  // @ts-expect-error jspdf-autotable augments jsPDF at runtime
  let afterTableY = doc.lastAutoTable.finalY + 20;

  // Totals block
  const totalsX = 360;
  const rows: [string, string][] = [
    ["Subtotal", formatCurrency(quotation.subtotal)],
    ["Discount", `- ${formatCurrency(quotation.discountTotal)}`],
    ["Taxable amount", formatCurrency(quotation.taxableAmount)],
    ["Tax", formatCurrency(quotation.taxTotal)],
    ["Round off", formatCurrency(quotation.roundOff)],
  ];

  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED);
  rows.forEach(([label, value]) => {
    doc.text(label, totalsX, afterTableY);
    doc.text(value, 555, afterTableY, { align: "right" });
    afterTableY += 16;
  });

  doc.setDrawColor(230);
  doc.line(totalsX, afterTableY, 555, afterTableY);
  afterTableY += 18;

  doc.setFontSize(12);
  doc.setTextColor("#111827");
  doc.text("Grand Total", totalsX, afterTableY);
  doc.text(formatCurrency(quotation.grandTotal), 555, afterTableY, { align: "right" });

  afterTableY += 40;

  // Notes / terms
  if (quotation.notes) {
    doc.setFontSize(10);
    doc.setTextColor("#111827");
    doc.text("Notes", marginX, afterTableY);
    doc.setTextColor(TEXT_MUTED);
    doc.text(doc.splitTextToSize(quotation.notes, 500), marginX, afterTableY + 14);
    afterTableY += 14 + doc.splitTextToSize(quotation.notes, 500).length * 12 + 16;
  }

  if (quotation.termsAndConditions) {
    doc.setFontSize(10);
    doc.setTextColor("#111827");
    doc.text("Terms & Conditions", marginX, afterTableY);
    doc.setTextColor(TEXT_MUTED);
    doc.text(
      doc.splitTextToSize(quotation.termsAndConditions, 500),
      marginX,
      afterTableY + 14,
    );
  }

  return doc;
}

function buildFileName(quotation: Quotation): string {
  const number = quotation.quotationNumber || quotation.id.slice(0, 8);
  return `Quotation-${number}.pdf`;
}

export async function downloadQuotationPdf(quotation: Quotation): Promise<void> {
  const doc = buildDocument(quotation);
  doc.save(buildFileName(quotation));
}

export async function printQuotationPdf(quotation: Quotation): Promise<void> {
  const doc = buildDocument(quotation);
  // Opens the browser's native print dialog against the generated PDF.
  doc.autoPrint();
  const blobUrl = doc.output("bloburl");
  window.open(blobUrl as unknown as string, "_blank");
}
