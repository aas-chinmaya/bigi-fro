"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor";
import type { QuotationFormValues } from "../../types/quotation-form.types";

export function QuotationAdditionalsSection() {
  const { watch, setValue } = useFormContext<QuotationFormValues>();

  const notes = watch("notes") ?? "";
  const termsAndConditions = watch("termsAndConditions") ?? "";

  return (
    <Card className="h-full">
      <style>{`
        .ProseMirror {
          min-height: 80px;
          max-height: 180px;
          overflow-y: auto;
          padding: 9px 11px;
          outline: none;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror p {
          margin: 0 0 5px;
        }

        .ProseMirror p:last-child {
          margin-bottom: 0;
        }
      `}</style>

      <CardHeader className="px-4 pb-3 pt-4">
        <CardTitle className="text-base font-semibold">
          Additional Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4 pt-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Terms & Conditions</Label>

          <RichTextEditor
            value={termsAndConditions}
            onChange={(value) =>
              setValue("termsAndConditions", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Payment terms, delivery, validity, etc."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Internal Notes</Label>

          <RichTextEditor
            value={notes}
            onChange={(value) =>
              setValue("notes", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Any additional notes..."
          />
        </div>
      </CardContent>
    </Card>
  );
}