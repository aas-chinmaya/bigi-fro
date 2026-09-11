"use client";

import { DataTable, NoData, Pagination } from "@/components/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { buildQuotationColumns } from "./quotation-columns";
import { useQuotationActions } from "../../hooks/use-quotation-actions";
import type { Quotation, QuotationPagination } from "../../types/quotation.types";

interface QuotationTableProps {
  quotations: Quotation[];
  pagination?: QuotationPagination;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
}

export function QuotationTable({
  quotations,
  pagination,
  isLoading,
  page,
  onPageChange,
  onResetFilters,
}: QuotationTableProps) {
  const actions = useQuotationActions();
  const columns = buildQuotationColumns(actions);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <DataTable
          columns={columns}
          data={quotations}
          loading={isLoading}
          emptyMessage="No quotations found."
        />

        {!isLoading && quotations.length === 0 && (
          <NoData
            title="No quotations found"
            description="Try adjusting your search or filters, or create a new quotation."
            onReset={onResetFilters}
          />
        )}

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            totalRecords={pagination.total}
            pageSize={pagination.limit}
            onPageChange={onPageChange}
          />
        )}
      </div>

      <ConfirmDialog
        open={actions.confirmTarget.kind !== null}
        title={actions.confirmTarget.kind === "delete" ? "Delete quotation?" : "Cancel quotation?"}
        description={
          actions.confirmTarget.kind === "delete"
            ? `This will permanently delete quotation ${
                actions.confirmTarget.quotation?.quotationNumber ?? ""
              }. This action cannot be undone.`
            : `This will mark quotation ${
                actions.confirmTarget.quotation?.quotationNumber ?? ""
              } as cancelled.`
        }
        confirmLabel={actions.confirmTarget.kind === "delete" ? "Delete" : "Cancel Quotation"}
        cancelLabel="Go back"
        loading={actions.isConfirming}
        onConfirm={actions.confirmAction}
        onCancel={actions.closeConfirm}
      />
    </div>
  );
}
