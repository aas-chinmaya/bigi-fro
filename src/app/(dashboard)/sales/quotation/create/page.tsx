// app/(dashboard)/sales/quotations/create/page.tsx
import { QuotationForm } from "@/modules/sales/quotation/components/form/quotation-form";

export default function CreateQuotationPage() {
  return (
    <div className="container max-w-7xl py-6">
      <QuotationForm mode="create" />
    </div>
  );
}