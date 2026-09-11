import { formatCurrency, formatDate } from "../../lib/format";
import { QuotationStatusBadge } from "../list/quotation-status-badge";
import type { Quotation } from "../../types/quotation.types";

interface QuotationDocumentProps {
  quotation: Quotation;
}

/**
 * The visual quotation document — used both on-screen (view page) and
 * as the source of truth for what the PDF generator reproduces. Kept
 * as pure presentational markup with `print:` variants so the browser's
 * native print (triggered from the action sidebar) also renders cleanly.
 */
export function QuotationDocument({ quotation }: QuotationDocumentProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 print:rounded-none print:border-0 print:p-0">
      <div className="flex items-start justify-between border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quotation</h2>
          <p className="mt-1 text-sm text-gray-500">
            {quotation.quotationNumber ? `#${quotation.quotationNumber}` : "Draft"}
          </p>
        </div>

        <div className="text-right">
          <QuotationStatusBadge status={quotation.status} />
          <p className="mt-2 text-sm text-gray-500">
            Date: <span className="font-medium text-gray-800">{formatDate(quotation.quotationDate)}</span>
          </p>
          {quotation.validUntil && (
            <p className="text-sm text-gray-500">
              Valid until:{" "}
              <span className="font-medium text-gray-800">{formatDate(quotation.validUntil)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-b border-gray-100 py-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Billed to</p>
          <p className="mt-2 text-sm font-medium text-gray-900">{quotation.customerName || "-"}</p>
          {quotation.customerPhone && <p className="text-sm text-gray-500">{quotation.customerPhone}</p>}
          {quotation.customerEmail && <p className="text-sm text-gray-500">{quotation.customerEmail}</p>}
          {quotation.customerGSTIN && (
            <p className="text-sm text-gray-500">GSTIN: {quotation.customerGSTIN}</p>
          )}
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Payment Terms</p>
          <p className="mt-2 text-sm font-medium text-gray-900">
            {quotation.paymentTerms?.replaceAll("_", " ") || "-"}
          </p>
        </div>
      </div>

      <div className="py-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="pb-2">#</th>
              <th className="pb-2">Item</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Rate</th>
              <th className="pb-2 text-right">Discount</th>
              <th className="pb-2 text-right">Tax</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, index) => (
              <tr key={item.id ?? index} className="border-b border-gray-50">
                <td className="py-3 text-gray-400">{index + 1}</td>
                <td className="py-3">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  {item.description && (
                    <p className="text-xs text-gray-400">{item.description}</p>
                  )}
                </td>
                <td className="py-3 text-right text-gray-600">
                  {item.quantity} {item.unit}
                </td>
                <td className="py-3 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                <td className="py-3 text-right text-gray-600">
                  {item.discountType === "PERCENTAGE"
                    ? `${item.discountValue}%`
                    : formatCurrency(item.discountValue)}
                </td>
                <td className="py-3 text-right text-gray-600">{item.taxRate}%</td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {formatCurrency(item.amount ?? item.quantity * item.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(quotation.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Discount</span>
            <span>- {formatCurrency(quotation.discountTotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tax</span>
            <span>{formatCurrency(quotation.taxTotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Round off</span>
            <span>{formatCurrency(quotation.roundOff)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
            <span>Grand Total</span>
            <span>{formatCurrency(quotation.grandTotal)}</span>
          </div>
        </div>
      </div>

      {(quotation.notes || quotation.termsAndConditions) && (
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
          {quotation.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p>
              <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{quotation.notes}</p>
            </div>
          )}
          {quotation.termsAndConditions && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Terms &amp; Conditions
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                {quotation.termsAndConditions}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
