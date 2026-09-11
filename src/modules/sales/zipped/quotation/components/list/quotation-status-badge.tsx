import { Badge } from "@/components/ui/badge";
import type { QuotationStatus } from "../../types/quotation.types";

const STATUS_VARIANT: Record<QuotationStatus, "success" | "warning" | "danger" | "primary"> = {
  DRAFT: "warning",
  SENT: "primary",
  ACCEPTED: "success",
  REJECTED: "danger",
  EXPIRED: "danger",
  CANCELLED: "danger",
};

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "primary"}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
