"use client";

interface QuotationActivityItemProps {
  title: string;
  timestamp: string;
  isLast?: boolean;
}

export default function QuotationActivityItem({
  title,
  timestamp,
  isLast,
}: QuotationActivityItemProps) {
  return (
    <div className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && (
        <span className="absolute left-[5px] top-3 h-full w-px bg-gradient-to-b from-violet-200 to-violet-50" />
      )}
      <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-violet-500 bg-white shadow-sm shadow-violet-200" />
      <div className="min-w-0">
        <p className="text-sm text-gray-700">{title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{timestamp}</p>
      </div>
    </div>
  );
}