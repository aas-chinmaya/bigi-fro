"use client";

import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui";

type QuotationActionsProps = {
  id: string;
  quotationNumber?: string;
  status?: string | null;
};

export default function QuotationActions({
  id,
}: QuotationActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      {/* ==================================================
          VIEW
      ================================================== */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="View quotation"
        title="View quotation"
        onClick={() =>
          router.push(
            `/sales/quotation/${id}`,
          )
        }
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye className="size-4" />
      </Button>

      {/* ==================================================
          EDIT
      ================================================== */}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Edit quotation"
        title="Edit quotation"
        onClick={() =>
          router.push(
            `/sales/quotation/${id}/edit`,
          )
        }
        className="hover:bg-blue-50 hover:text-blue-600"
      >
        <Pencil className="size-4" />
      </Button>
    </div>
  );
}