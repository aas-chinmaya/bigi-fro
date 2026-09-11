"use client";

import { useRouter } from "next/navigation";
import {
  Copy,
  Download,
  FileOutput,
  Pencil,
  Printer,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useQuotationActions } from "../../hooks/use-quotation-actions";
import {
  CONVERTIBLE_STATUSES,
  EDITABLE_STATUSES,
} from "../../types/quotation.types";
import { QuotationStatusBadge } from "../list/quotation-status-badge";
import type { Quotation } from "../../types/quotation.types";

interface QuotationViewSidebarProps {
  quotation: Quotation;
  actions: ReturnType<typeof useQuotationActions>;
}

export function QuotationViewSidebar({ quotation, actions }: QuotationViewSidebarProps) {
  const router = useRouter();

  const canEdit = EDITABLE_STATUSES.includes(quotation.status);
  const canConvert = CONVERTIBLE_STATUSES.includes(quotation.status);
  const canCancel = quotation.status !== "CANCELLED" && quotation.status !== "EXPIRED";

  return (
    <aside className="sticky top-6 space-y-4 print:hidden">
      <Card className="space-y-3 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
        <QuotationStatusBadge status={quotation.status} />
      </Card>

      <Card className="space-y-2 p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Document
        </p>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          disabled={actions.isPrinting}
          onClick={() => actions.print(quotation)}
        >
          {actions.isPrinting ? <Spinner /> : <Printer className="h-4 w-4" />}
          Print
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          disabled={actions.isDownloading}
          onClick={() => actions.download(quotation)}
        >
          {actions.isDownloading ? <Spinner /> : <Download className="h-4 w-4" />}
          Download PDF
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          disabled={!canEdit}
          onClick={() => router.push(`/sales/quotation/${quotation.id}/edit`)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </Card>

      <Card className="space-y-2 p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Actions
        </p>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          disabled={actions.isSending}
          onClick={() => actions.send(quotation)}
        >
          {actions.isSending ? <Spinner /> : <Send className="h-4 w-4" />}
          Send to customer
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          disabled={actions.isDuplicating}
          onClick={() => actions.duplicate(quotation)}
        >
          {actions.isDuplicating ? <Spinner /> : <Copy className="h-4 w-4" />}
          Duplicate
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          disabled={!canConvert || actions.isConverting}
          onClick={() => actions.convert(quotation)}
        >
          {actions.isConverting ? <Spinner /> : <FileOutput className="h-4 w-4" />}
          Convert to Invoice
        </Button>
      </Card>

      <Card className="space-y-2 p-4">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5 text-amber-600 hover:text-amber-700"
          disabled={!canCancel}
          onClick={() => actions.askCancel(quotation)}
        >
          <XCircle className="h-4 w-4" />
          Cancel Quotation
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5 text-red-600 hover:text-red-700"
          onClick={() => actions.askDelete(quotation)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Quotation
        </Button>
      </Card>
    </aside>
  );
}
