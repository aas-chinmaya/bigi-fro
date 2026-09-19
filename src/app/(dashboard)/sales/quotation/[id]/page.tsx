import { QuotationView } from "@/modules/sales/quotation/components/view/quotation-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuotationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <QuotationView id={id} />;
}
