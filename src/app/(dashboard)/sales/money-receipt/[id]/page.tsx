import ReceiptDetails from "@/modules/sales/money-receipt/components/view/receipt-details";

interface MoneyReceiptDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MoneyReceiptDetailsPage({
  params,
}: MoneyReceiptDetailsPageProps) {
  const { id } = await params;

  return <ReceiptDetails id={id} />;
}