
import EditInvoiceWrapper from "@/modules/sales/invoice/components/edit/EditInvoiceWrapper";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditInvoicePage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <EditInvoiceWrapper
      invoiceId={id}
    />
  );
}