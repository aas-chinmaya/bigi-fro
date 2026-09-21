/**
 * Generate & download quotation as PDF via browser print.
 * Opens a print window with document HTML — user can Save as PDF.
 * For server-side PDF later, swap implementation behind same API.
 */
import type { Quotation } from "../types/quotation.types";
import { amountInWords } from "@/modules/sales/shared/utils/amount-in-words";

function money(n: number) {
  return `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function esc(s: string | null | undefined) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(html: string | null | undefined) {
  return String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildQuotationHtml(q: Quotation): string {
  const isInter = q.taxType === "INTER_STATE";
  const items = q.items || [];

  const rows = items
    .map((it, i) => {
      const price = Number(it.price ?? it.rate ?? 0);
      const total = Number(it.total ?? it.amount ?? 0);
      const taxCell = isInter
        ? `${it.igstRate ?? it.taxRate ?? 0}% / ${money(it.igstAmount ?? 0)}`
        : `C${it.cgstRate ?? 0}% ${money(it.cgstAmount ?? 0)} · S${it.sgstRate ?? 0}% ${money(it.sgstAmount ?? 0)}`;
      return `<tr>
        <td style="padding:6px;border:1px solid #ccc;text-align:center">${i + 1}</td>
        <td style="padding:6px;border:1px solid #ccc">${esc(it.itemName)}<br/><span style="color:#666;font-size:11px">${esc(it.description)}</span></td>
        <td style="padding:6px;border:1px solid #ccc;text-align:center">${it.quantity}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:center">${esc(it.unit || "PCS")}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right">${money(price)}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px">${taxCell}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right">${money(total)}</td>
      </tr>`;
    })
    .join("");

  const taxRows = isInter
    ? `<tr><td style="padding:4px 0">IGST</td><td style="text-align:right">${money(q.igstAmount)}</td></tr>`
    : `<tr><td style="padding:4px 0">CGST</td><td style="text-align:right">${money(q.cgstAmount)}</td></tr>
       <tr><td style="padding:4px 0">SGST</td><td style="text-align:right">${money(q.sgstAmount)}</td></tr>`;

  const sig = q.signature
    ? `<img src="${q.signature}" alt="Signature" style="max-height:64px;max-width:160px;object-fit:contain" />`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(q.quotationNumber || "Quotation")}</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 12px; color: #111; margin: 24px; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    table { border-collapse: collapse; width: 100%; }
    .muted { color: #666; }
    @media print {
      body { margin: 12px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:16px">
    <div>
      <h1>${esc(q.businessName)}</h1>
      <div class="muted">${esc(q.businessGSTIN ? "GSTIN: " + q.businessGSTIN : "")}</div>
      <div class="muted">${esc([q.businessAddressLine1, q.businessCity, q.businessState].filter(Boolean).join(", "))}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:16px;font-weight:600">QUOTATION</div>
      <div>${esc(q.quotationNumber || "")}</div>
      <div class="muted">Date: ${fmtDate(q.quotationDate)}</div>
      <div class="muted">Valid until: ${fmtDate(q.validUntil)}</div>
      <div class="muted">Status: ${esc(q.quotationStatus)}</div>
    </div>
  </div>

  <div style="margin-bottom:12px">
    <div style="font-weight:600">Bill to</div>
    <div>${esc(q.prospectName)}</div>
    <div class="muted">${esc(q.prospectCompanyName)}</div>
    <div class="muted">${esc([q.prospectAddressLine1, q.prospectCity, q.prospectState, q.prospectPincode].filter(Boolean).join(", "))}</div>
    <div class="muted">${esc(q.prospectGSTIN ? "GSTIN: " + q.prospectGSTIN : "")}</div>
  </div>

  <table style="margin-bottom:12px">
    <thead>
      <tr style="background:#f5f5f5">
        <th style="padding:6px;border:1px solid #ccc">#</th>
        <th style="padding:6px;border:1px solid #ccc;text-align:left">Item</th>
        <th style="padding:6px;border:1px solid #ccc">Qty</th>
        <th style="padding:6px;border:1px solid #ccc">UOM</th>
        <th style="padding:6px;border:1px solid #ccc;text-align:right">Price</th>
        <th style="padding:6px;border:1px solid #ccc">Tax</th>
        <th style="padding:6px;border:1px solid #ccc;text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div style="display:flex;justify-content:flex-end">
    <table style="width:260px">
      <tr><td style="padding:4px 0">Taxable</td><td style="text-align:right">${money(q.taxableAmount)}</td></tr>
      ${q.discountAmount ? `<tr><td style="padding:4px 0">Discount</td><td style="text-align:right">−${money(q.discountAmount)}</td></tr>` : ""}
      ${taxRows}
      ${q.roundOffAmount ? `<tr><td style="padding:4px 0">Round off</td><td style="text-align:right">${money(q.roundOffAmount)}</td></tr>` : ""}
      <tr style="font-weight:700;font-size:14px"><td style="padding:8px 0;border-top:1px solid #111">Grand total</td><td style="text-align:right;border-top:1px solid #111">${money(q.grandTotal)}</td></tr>
    </table>
  </div>

  <p class="muted" style="margin-top:8px">${esc(amountInWords(q.grandTotal))}</p>

  ${
    stripHtml(q.termsAndConditions)
      ? `<div style="margin-top:16px"><div style="font-weight:600">Terms</div><p>${esc(stripHtml(q.termsAndConditions))}</p></div>`
      : ""
  }

  <div style="margin-top:32px;display:flex;justify-content:flex-end">
    <div style="text-align:center">
      ${sig}
      <div style="border-top:1px solid #999;padding-top:4px;min-width:140px">Authorized Signatory</div>
    </div>
  </div>
</body>
</html>`;
}

/** Open print dialog so user can Save as PDF */
export function downloadQuotationPdf(q: Quotation) {
  const html = buildQuotationHtml(q);
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!w) {
    throw new Error("Popup blocked — allow popups to download PDF");
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  // wait for images (signature) then print
  const trigger = () => {
    try {
      w.focus();
      w.print();
    } catch {
      /* ignore */
    }
  };
  if (q.signature) {
    setTimeout(trigger, 400);
  } else {
    setTimeout(trigger, 150);
  }
}
