import { QuotationViewPage } from "@/modules/sales/quotation";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <QuotationViewPage quotationId={params.id} />;
}
