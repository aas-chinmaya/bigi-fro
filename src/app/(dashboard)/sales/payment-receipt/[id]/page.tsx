




import ReceiptDetailsWrapper from "@/modules/sales/payment-receipt/components/view/receipt-details-wrapper";

interface PaymentReceiptDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    businessId?: string;
  }>;
}

export default async function PaymentReceiptDetailsPage({
  params,
  searchParams,
}: PaymentReceiptDetailsPageProps) {
  const { id } = await params;
  const { businessId } = await searchParams;

  return <ReceiptDetailsWrapper id={id} businessId={businessId} />;
}