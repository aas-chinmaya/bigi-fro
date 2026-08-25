import ReceiptDetails from "@/modules/sales/cash-receipt/components/view/receipt-details";

interface CashReceiptDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CashReceiptDetailsPage({
  params,
}: CashReceiptDetailsPageProps) {
  const { id } = await params;

  return <ReceiptDetails id={id} />;
}