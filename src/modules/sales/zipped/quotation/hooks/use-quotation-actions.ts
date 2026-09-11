"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { notify } from "@/lib/toast";
import {
  useCancelQuotationMutation,
  useDeleteQuotationMutation,
  useDuplicateQuotationMutation,
  useSendQuotationMutation,
  useConvertQuotationToInvoiceMutation,
} from "../api/quotation.api";
import { downloadQuotationPdf, printQuotationPdf } from "../utils/generate-quotation-pdf";
import type { Quotation } from "../types/quotation.types";

type ConfirmKind = "delete" | "cancel" | null;

/**
 * Central place for every mutating / document action a quotation can
 * trigger from the list row menu or the view screen's sidebar:
 * delete, cancel, duplicate, send, convert-to-invoice, print, download.
 */
export function useQuotationActions() {
  const router = useRouter();

  const [deleteQuotation, { isLoading: isDeleting }] = useDeleteQuotationMutation();
  const [cancelQuotation, { isLoading: isCancelling }] = useCancelQuotationMutation();
  const [duplicateQuotation, { isLoading: isDuplicating }] = useDuplicateQuotationMutation();
  const [sendQuotation, { isLoading: isSending }] = useSendQuotationMutation();
  const [convertToInvoice, { isLoading: isConverting }] = useConvertQuotationToInvoiceMutation();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState<{
    kind: ConfirmKind;
    quotation: Quotation | null;
  }>({ kind: null, quotation: null });

  const askDelete = useCallback((quotation: Quotation) => {
    setConfirmTarget({ kind: "delete", quotation });
  }, []);

  const askCancel = useCallback((quotation: Quotation) => {
    setConfirmTarget({ kind: "cancel", quotation });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmTarget({ kind: null, quotation: null });
  }, []);

  const confirmAction = useCallback(async () => {
    if (!confirmTarget.quotation) return;
    const id = confirmTarget.quotation.id;

    try {
      if (confirmTarget.kind === "delete") {
        await deleteQuotation(id).unwrap();
        notify.success("Quotation deleted");
      }

      if (confirmTarget.kind === "cancel") {
        await cancelQuotation({ id }).unwrap();
        notify.success("Quotation cancelled");
      }

      closeConfirm();
    } catch (error: any) {
      notify.error(error?.data?.message || "Action failed. Please try again.");
    }
  }, [confirmTarget, deleteQuotation, cancelQuotation, closeConfirm]);

  const duplicate = useCallback(
    async (quotation: Quotation) => {
      try {
        const result = await duplicateQuotation({ id: quotation.id }).unwrap();
        notify.success("Quotation duplicated");
        router.push(`/sales/quotation/${result.data.id}/edit`);
      } catch (error: any) {
        notify.error(error?.data?.message || "Could not duplicate quotation");
      }
    },
    [duplicateQuotation, router],
  );

  const send = useCallback(
    async (quotation: Quotation) => {
      try {
        await sendQuotation({
          id: quotation.id,
          data: { email: quotation.customerEmail, phone: quotation.customerPhone },
        }).unwrap();
        notify.success(`Quotation sent to ${quotation.customerName || "customer"}`);
      } catch (error: any) {
        notify.error(error?.data?.message || "Could not send quotation");
      }
    },
    [sendQuotation],
  );

  const convert = useCallback(
    async (quotation: Quotation) => {
      try {
        await convertToInvoice({ id: quotation.id }).unwrap();
        notify.success("Converted to invoice");
        router.push(`/sales/quotation/${quotation.id}`);
      } catch (error: any) {
        notify.error(error?.data?.message || "Could not convert to invoice");
      }
    },
    [convertToInvoice, router],
  );

  const print = useCallback(async (quotation: Quotation) => {
    setIsPrinting(true);
    try {
      await printQuotationPdf(quotation);
    } catch {
      notify.error("Could not open print preview");
    } finally {
      setIsPrinting(false);
    }
  }, []);

  const download = useCallback(async (quotation: Quotation) => {
    setIsDownloading(true);
    try {
      await downloadQuotationPdf(quotation);
      notify.success("PDF downloaded");
    } catch {
      notify.error("Could not generate PDF");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    // confirm-dialog state
    confirmTarget,
    askDelete,
    askCancel,
    closeConfirm,
    confirmAction,
    isConfirming: isDeleting || isCancelling,

    // direct actions
    duplicate,
    isDuplicating,

    send,
    isSending,

    convert,
    isConverting,

    print,
    isPrinting,

    download,
    isDownloading,
  };
}
