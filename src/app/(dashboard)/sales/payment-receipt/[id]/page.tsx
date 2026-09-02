import ReceiptDetails from "@/modules/sales/payment-receipt/components/view/receipt-details";

interface PaymentReceiptDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentReceiptDetailsPage({
  params,
}: PaymentReceiptDetailsPageProps) {
  const { id } = await params;

  return <ReceiptDetails id={id} />;
}