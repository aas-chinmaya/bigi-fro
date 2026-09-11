"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QUOTATION_SOURCE_OPTIONS,
  QUOTATION_STATUS_OPTIONS,
} from "../../types/quotation.types";
import type { QuotationSource, QuotationStatus } from "../../types/quotation.types";

interface QuotationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: QuotationStatus | "ALL";
  onStatusChange: (value: QuotationStatus | "ALL") => void;

  source: QuotationSource | "ALL";
  onSourceChange: (value: QuotationSource | "ALL") => void;

  fromDate: string;
  onFromDateChange: (value: string) => void;

  toDate: string;
  onToDateChange: (value: string) => void;

  onReset: () => void;
}

export function QuotationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onReset,
}: QuotationFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          defaultValue={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by quotation # or customer"
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={(v) => onStatusChange(v as QuotationStatus | "ALL")}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {QUOTATION_STATUS_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={source} onValueChange={(v) => onSourceChange(v as QuotationSource | "ALL")}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All sources</SelectItem>
          {QUOTATION_SOURCE_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <DateInput
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-40"
        />
        <span className="text-sm text-gray-400">to</span>
        <DateInput
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="w-40"
        />
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
