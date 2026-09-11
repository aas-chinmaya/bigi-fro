"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { SelectOption } from "../../types/quotation-form.types";

interface QuotationSearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  loading?: boolean;
  placeholder?: string;
  onSearch?: (term: string) => void;
  disabled?: boolean;
}

/**
 * A Select with a search box pinned to the top of the dropdown —
 * used for both the customer picker and the item picker, both of
 * which can have long, server-backed lists.
 */
export function QuotationSearchableSelect({
  value,
  onChange,
  options,
  loading,
  placeholder = "Select...",
  onSearch,
  disabled,
}: QuotationSearchableSelectProps) {
  const [localTerm, setLocalTerm] = useState("");

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <div className="sticky top-0 z-10 bg-white p-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              value={localTerm}
              onChange={(e) => {
                setLocalTerm(e.target.value);
                onSearch?.(e.target.value);
              }}
              placeholder="Search..."
              className="h-8 pl-8 text-sm"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-gray-500">
            <Spinner /> Loading...
          </div>
        )}

        {!loading && options.length === 0 && (
          <div className="px-3 py-4 text-center text-sm text-gray-400">No results found</div>
        )}

        {!loading &&
          options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
