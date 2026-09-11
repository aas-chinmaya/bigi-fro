"use client";

import { useRouter } from "next/navigation";
import {
  Copy,
  Download,
  Eye,
  FileOutput,
  MoreVertical,
  Pencil,
  Printer,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useQuotationActions } from "../../hooks/use-quotation-actions";
import {
  CONVERTIBLE_STATUSES,
  EDITABLE_STATUSES,
} from "../../types/quotation.types";
import type { Quotation } from "../../types/quotation.types";

interface QuotationRowActionsProps {
  quotation: Quotation;
  actions: ReturnType<typeof useQuotationActions>;
}

export function QuotationRowActions({ quotation, actions }: QuotationRowActionsProps) {
  const router = useRouter();

  const canEdit = EDITABLE_STATUSES.includes(quotation.status);
  const canConvert = CONVERTIBLE_STATUSES.includes(quotation.status);
  const canCancel = quotation.status !== "CANCELLED" && quotation.status !== "EXPIRED";
  const isBusy =
    actions.isDownloading || actions.isPrinting || actions.isDuplicating || actions.isSending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label="Quotation actions">
          {isBusy ? <Spinner /> : <MoreVertical className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(`/sales/quotation/${quotation.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={!canEdit}
          onClick={() => router.push(`/sales/quotation/${quotation.id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => actions.print(quotation)}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => actions.download(quotation)}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => actions.duplicate(quotation)}>
          <Copy className="mr-2 h-4 w-4" /> Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => actions.send(quotation)}>
          <Send className="mr-2 h-4 w-4" /> Send to customer
        </DropdownMenuItem>

        <DropdownMenuItem disabled={!canConvert} onClick={() => actions.convert(quotation)}>
          <FileOutput className="mr-2 h-4 w-4" /> Convert to Invoice
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={!canCancel}
          onClick={() => actions.askCancel(quotation)}
          className="text-amber-600 focus:text-amber-600"
        >
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => actions.askDelete(quotation)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
