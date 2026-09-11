import { EditQuotationPage } from "@/modules/sales/quotation";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <EditQuotationPage quotationId={params.id} />;
}
