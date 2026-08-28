"use client";

import BuyerInformationCard from "./buyer-information-card";
import InvoiceDetailsCard from "./invoice-details-card";
import InvoiceItemsCard from "./invoice-items-card";
import InvoicePaymentCard from "./invoice-payment-card";
import InvoiceAdditionalCard from "./invoice-additional-card";

// ==========================================================
// INVOICE FORM LAYOUT
//
// The card grid is identical between Create and Edit — this
// was previously duplicated in both wrappers. Pulling it out
// here means the UI only needs to be touched in one place.
// Visual output is unchanged (same classNames, same structure).
// ==========================================================

export default function InvoiceFormLayout() {
  return (
    <>
      {/* ================================================
          BUYER + INVOICE
      ================================================ */}

      <div className="grid min-w-0 grid-cols-1 xl:grid-cols-2">
        <div className="min-w-0 p-4 sm:p-5 lg:p-6">
          <BuyerInformationCard />
        </div>

        <div className="min-w-0 border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
          <InvoiceDetailsCard />
        </div>
      </div>

      {/* ================================================
          ITEMS
      ================================================ */}

      <div className="border-t border-gray-200 p-4 sm:p-5 lg:p-6">
        <InvoiceItemsCard />
      </div>

      {/* ================================================
          PAYMENT + ADDITIONAL
      ================================================ */}

      <div className="grid lg:grid-cols-2">
        <div className="border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
          <InvoicePaymentCard />
        </div>

        <div className="border-t border-gray-200 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
          <InvoiceAdditionalCard />
        </div>
      </div>
    </>
  );
}
