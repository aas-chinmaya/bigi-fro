import QuotationDetailsWrapper from "@/modules/sales/quotation/components/view/quotation-details-wrapper";

interface QuotationDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuotationDetailsPage({
  params,
}: QuotationDetailsPageProps) {
  const { id } = await params;

  return <QuotationDetailsWrapper id={id} />;
}